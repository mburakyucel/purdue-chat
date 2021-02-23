import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as Croppie from 'croppie';
import { CroppieOptions, ResultOptions } from 'croppie';

import { ImageUploadService } from 'src/app/services/image-upload.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private auth: AuthService,
    private _snackBar: MatSnackBar
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
    this._croppie.result(this.outputFormatOptions).then((result: any) => {
      this.uploadService.uploadImage(result).subscribe((url: string) => {
        this.uploadService
          .uploadProfileImage(url, this.auth.getUid())
          .then(() => {
            this._snackBar.open('Image uploaded successfully', 'Close', {
              duration: 2000,
            });
          })
          .catch((error) => console.log(error));
      });

      this._croppie.destroy();
      this._croppie = null;
    });
  }
}
