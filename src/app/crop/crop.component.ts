import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import * as Croppie from 'croppie';
import { CroppieOptions, ResultOptions, CropData } from 'croppie';

import { ImageUploadService } from 'src/app/services/image-upload.service'
import { AuthService } from 'src/app/services/auth.service'

export type Type = 'canvas' | 'base64' | 'html' | 'blob' | 'rawcanvas';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.css']
})
export class CropComponent implements OnInit {
	@ViewChild('imageEdit') imageEdit: ElementRef;

	croppieOptions: CroppieOptions = {
		viewport: { width: 100, height: 100, type: 'circle' },
		boundary: { width: 300, height: 300 },
		showZoomer: true,
		enableOrientation: true,
		enableZoom: true
	};

	@Input() points: number[];
	@Input() defaultZoom = 0;
	@Output() result: EventEmitter<string | HTMLElement | Blob | HTMLCanvasElement> = new EventEmitter<string | HTMLElement | Blob | HTMLCanvasElement>();
	private _croppie: Croppie;
  	private file:any;
	private imgUrl: string;
	private ref: AngularFireStorageReference;
	private task: AngularFireUploadTask;
	private outputFormatOptions: ResultOptions = { type: 'base64', size: 'viewport' };

	constructor(private storage: AngularFireStorage, private uploadService:ImageUploadService, private auth: AuthService) { }

	ngOnInit(): void {
	}

	get imageUrl(): string {
		return this.imgUrl;
	}
  
	@Input() set imageUrl(url: string) {
		if(this.imgUrl === url) { 
			return; 
		}

		this.imgUrl = url;

		if (this._croppie) {
			this.bindToCroppie(this.imageUrl, this.points, this.defaultZoom);
		}
	}

	enterImage():any{
		this._croppie = new Croppie(this.imageEdit.nativeElement, this.croppieOptions);
		this.bindToCroppie(this.imageUrl, this.points, this.defaultZoom);
	}

	private bindToCroppie(url: string, points: number[], zoom: number){
		this._croppie.bind({ url, points, zoom });
	}

	newResult() {
		this._croppie.result(this.outputFormatOptions).then((res) => {
			this.result.emit(res);
		});

	}

	rotate(degrees: 90 | 180 | 270 | -90 | -180 | -270) {
		this._croppie.rotate(degrees);
	}

	get(): CropData {
    	console.log(this._croppie.result({type: 'base64', circle: true }));
		return this._croppie.get();
	}

	onInputChange(event:any):void{
    	if(this._croppie){
			this._croppie.destroy();
		}
    
		this.file = event.target.files[0];
		var reader = new FileReader();

		this._croppie = new Croppie(this.imageEdit.nativeElement, this.croppieOptions);

		reader.onload = (e1:any) => {
			this.bindToCroppie(e1.target.result, this.points, this.defaultZoom);
		}

		reader.readAsDataURL(this.file);
	}

	submit():void{
		this._croppie.result(this.outputFormatOptions).then(result => {

			//-------Start Firebase stuff ------
			const randomId = Math.random().toString(36).substring(2);
			this.ref = this.storage.ref(randomId);
			var img = String(result)
			this.task = this.ref.putString(img.split(',')[1], 'base64')

			this.task.snapshotChanges().pipe(finalize(() => {
				this.ref.getDownloadURL().subscribe(downloadURL => {
					console.log(downloadURL)
				})
			})).subscribe()
			//------ End of Firbase stuff ------

			this._croppie.destroy()
			this._croppie = null
		});
	}

	newSubmit():void{
		this._croppie.result(this.outputFormatOptions).then(result => {
			this.uploadService.uploadImage(String(result)).subscribe((url:string) => {
				console.log(url)
				this.uploadService.uploadProfileImage(url, this.auth.getUid()).subscribe((check:number) => {
					console.log(check)
				})
			})
			
			this._croppie.destroy()
			this._croppie = null
		});

	}
}
