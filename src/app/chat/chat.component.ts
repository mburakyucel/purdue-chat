import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { ImageUploadService } from '../services/image-upload.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chatId: string;
  messages$: any;
  messages: any[] = [];
  selectedImageFile: any;
  imageUrl: any;
  imageLoading = false;
  messageControl = new FormControl('', [Validators.maxLength(1024)]);
  unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild('inputMessage') inputMessage: ElementRef<HTMLInputElement>;
  constructor(
    public chatService: ChatService,
    public route: ActivatedRoute,
    public router: Router,
    public imageUploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    this.messages$ = this.route.paramMap.pipe(
      switchMap((params) => {
        console.log(params);
        this.chatId = params.get('chatId');
        return this.chatService.getMessages(this.chatId);
      })
    );
    this.messages$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Array<DocumentData>) => {
        this.messages = data.sort((m1, m2) => m1.createdAt - m2.createdAt);
      });
  }

  sendMessage() {
    if (this.imageUrl) {
      this.imageLoading = true;
      this.imageUploadService
        .uploadImage(this.imageUrl)
        .subscribe((imageUrl: string) => {
          this.chatService.sendMessage(imageUrl, this.chatId, 'image');
          this.imageLoading = false;
          this.imageUrl = null;
          console.log(imageUrl);
        });
    } else {
      if (this.messageControl.value.trim()) {
        this.chatService.sendMessage(
          this.messageControl.value,
          this.chatId,
          'text'
        );
        this.inputMessage.nativeElement.value = '';
        this.messageControl.setValue('');
        console.log('Sent');
      }
    }
  }

  ngOnDestroy() {
    console.log('onDestroy');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onImageSelect(event: any) {
    this.selectedImageFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (url: any) => {
      this.imageUrl = url.target.result;
    };

    reader.readAsDataURL(this.selectedImageFile);
  }
}
