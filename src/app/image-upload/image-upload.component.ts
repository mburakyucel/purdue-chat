import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  OnDestroy,
} from '@angular/core';

import * as Croppie from 'croppie';
import { CroppieOptions } from 'croppie';

import { ImageUploadService } from 'src/app/services/image-upload.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crop',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  @ViewChild('imageEdit') imageEdit: ElementRef;

  private points: number[];
  private defaultZoom = 0;
  private file: any;
  private imageUrl: string;
  public loading = false;
  public croppie: Croppie;

  constructor(
    private uploadService: ImageUploadService,
    public dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { croppieOptions: CroppieOptions }
  ) {}

  ngOnInit(): void {}

  enterImage(): any {
    this.croppie = new Croppie(
      this.imageEdit.nativeElement,
      this.data.croppieOptions
    );
    this.croppie.bind({
      url: this.imageUrl,
      points: this.points,
      zoom: this.defaultZoom,
    });
  }

  onInputChange(event: any): void {
    if (this.croppie) {
      this.croppie.destroy();
    }

    this.file = event.target.files[0];
    const reader = new FileReader();

    this.croppie = new Croppie(
      this.imageEdit.nativeElement,
      this.data.croppieOptions
    );

    reader.onload = (e1: any) => {
      this.croppie.bind({
        url: e1.target.result,
        points: this.points,
        zoom: this.defaultZoom,
      });
    };

    reader.readAsDataURL(this.file);
  }

  submit(): void {
    if (this.croppie) {
      this.loading = true;
      this.croppie
        .result({
          type: 'base64',
          size: 'viewport',
          circle: false,
        })
        .then((imageData: string) => {
          this.uploadService
            .uploadImage(imageData)
            .subscribe((imageUrl: string) => {
              this.loading = false;
              this.croppie.destroy();
              this.croppie = null;
              this.dialogRef.close(imageUrl);
            });
        });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy() {
    if (this.croppie) {
      this.croppie.destroy();
      this.croppie = null;
    }
  }
}
