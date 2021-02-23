import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';

import * as Croppie from 'croppie';
import { CroppieOptions, ResultOptions, CropData } from 'croppie';

import { ImageUploadService } from 'src/app/services/image-upload.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-crop',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('imageEdit') imageEdit: ElementRef;

  croppieOptions: CroppieOptions = {
    viewport: { width: 100, height: 100, type: 'circle' },
    boundary: { width: 300, height: 300 },
    showZoomer: true,
    enableOrientation: true,
    enableZoom: true,
  };

  private points: number[];
  private defaultZoom = 0;
  private _croppie: Croppie;
  private file: any;
  private imageUrl: string;
  private outputFormatOptions: ResultOptions = {
    type: 'base64',
    size: 'viewport',
    circle: false,
  };

  constructor(
    private uploadService: ImageUploadService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  enterImage(): any {
    this._croppie = new Croppie(
      this.imageEdit.nativeElement,
      this.croppieOptions
    );
    this._croppie.bind({
      url: this.imageUrl,
      points: this.points,
      zoom: this.defaultZoom,
    });
  }

  onInputChange(event: any): void {
    if (this._croppie) {
      this._croppie.destroy();
    }

    this.file = event.target.files[0];
    const reader = new FileReader();

    this._croppie = new Croppie(
      this.imageEdit.nativeElement,
      this.croppieOptions
    );

    reader.onload = (e1: any) => {
      this._croppie.bind({
        url: e1.target.result,
        points: this.points,
        zoom: this.defaultZoom,
      });
    };

    reader.readAsDataURL(this.file);
  }

  submit(): void {
    // console.log(this._croppie.result(this.outputFormatOptions));
    this._croppie.result(this.outputFormatOptions).then((result: any) => {
      console.log(result);
      this.uploadService.uploadImage(result).subscribe((url: string) => {
        console.log(url);
        this.uploadService
          .uploadProfileImage(url, this.auth.getUid())
          .then((data) => console.log(data))
          .catch((error) => console.log(error));
      });

      this._croppie.destroy();
      this._croppie = null;
    });
  }
}
