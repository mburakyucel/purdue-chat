import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

import * as Croppie from 'croppie';
import { CroppieOptions, ResultOptions, CropData } from 'croppie';

import { ImageUploadService } from 'src/app/services/image-upload.service'
import { AuthService } from 'src/app/services/auth.service'

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

	private points: number[];
	private defaultZoom = 0;
	public result: EventEmitter<string | HTMLElement | Blob | HTMLCanvasElement> = new EventEmitter<string | HTMLElement | Blob | HTMLCanvasElement>();
	private _croppie: Croppie;
  	private file:any;
	private imgUrl: string;
	private outputFormatOptions: ResultOptions = { type: 'base64', size: 'viewport' };

	constructor(private uploadService:ImageUploadService, private auth: AuthService) { }

	ngOnInit(): void {
	}

	get imageUrl(): string {
		return this.imgUrl;
	}
  
	set imageUrl(url: string) {
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
		const reader = new FileReader();

		this._croppie = new Croppie(this.imageEdit.nativeElement, this.croppieOptions);

		reader.onload = (e1:any) => {
			this.bindToCroppie(e1.target.result, this.points, this.defaultZoom);
		}

		reader.readAsDataURL(this.file);
	}

	submit():void{
		this._croppie.result(this.outputFormatOptions).then(result => {
			this.uploadService.uploadImage(String(result)).subscribe((url:string) => {
				this.uploadService.uploadProfileImage(url, this.auth.getUid()).subscribe()
			})

			this._croppie.destroy()
			this._croppie = null
		});
	}
}
