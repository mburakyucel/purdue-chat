import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { ImageUploadService } from '../services/image-upload.service';
import { SubscriptionService } from '../services/subscription.service';

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
  messageControl = new FormControl('');
  unsubscribe$: Subject<void> = new Subject<void>();

  dmRecipiant: any;
  myId: any;
  chatMetadata:any;
  
  @ViewChild('inputMessage') inputMessage: ElementRef<HTMLInputElement>;

  constructor(
    public chatService: ChatService,
    public route: ActivatedRoute,
    public router: Router,
    public imageUploadService: ImageUploadService,
    private authService: AuthService,
    private subService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    this.myId = this.authService.getUid()

    this.messages$ = this.route.paramMap.pipe(
      switchMap((params) => {
        console.log(params);
        this.chatId = params.get('chatId');

        this.chatService.getChatMetadata(this.chatId).subscribe((data: any) => {
          this.chatMetadata = data;
          if(data && data.type == 'dm'){
            this.subService.getDmUsers(this.myId, data.participants).subscribe((user:any) => {
              this.dmRecipiant = user
            })
          }
        });

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
    console.log(this.chatId)
    console.log(this.dmRecipiant.uid)
    console.log(this.chatMetadata)
    if(this.chatMetadata.type == 'dm'){
      console.log("added subscribed")
      this.subService.addSubscription(this.chatId, this.dmRecipiant.uid);
    }
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
