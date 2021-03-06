import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Inject,
} from '@angular/core';

import * as Croppie from 'croppie';
import { CroppieOptions, ResultOptions } from 'croppie';

import { ImageUploadService } from 'src/app/services/image-upload.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crop',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('imageEdit') imageEdit: ElementRef;

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
    public dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { croppieOptions: CroppieOptions }
  ) {}

  ngOnInit(): void {}

  enterImage(): any {
    this._croppie = new Croppie(
      this.imageEdit.nativeElement,
      this.data.croppieOptions
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
      this.data.croppieOptions
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
    this._croppie.result(this.outputFormatOptions).then((result: any) => {
      this.dialogRef.close(this.uploadService.uploadImage(result));
      this._croppie.destroy();
      this._croppie = null;
    });
  }

  cancel(): void {
    this._croppie.destroy();
    this._croppie = null;
  }
}
