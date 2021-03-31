import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
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
  chatMetadata: any;
  messages: any[] = [];
  users: any = {};
  selectedImageFile: any;
  imageUrl: any;
  imageLoading = false;
  messageControl = new FormControl('');
  unsubscribe$: Subject<void> = new Subject<void>();

  recipientUser: any;

  @ViewChild('messageSection', { read: ElementRef })
  public messageSection: ElementRef<any>;
  @ViewChild('inputMessage') inputMessage: ElementRef<HTMLInputElement>;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private imageUploadService: ImageUploadService,
    private subService: SubscriptionService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => params.get('chatId')),
        switchMap((chatId: string) => this.chatService.getChatMetadata(chatId)),
        switchMap((data: any) => {
          this.chatMetadata = data;
          if(data.type === 'dm') {
            return this.subService.getDmRecipiant(this.auth.getUid(), data.participants)
          } else{
            return of(null);
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data: any) => {
        /* recipientUser is null if selected chat is a group chat */
        this.recipientUser = data;
      });
    this.route.paramMap
      .pipe(
        tap((params) => (this.chatId = params.get('chatId'))),
        switchMap(() => this.chatService.getMessages(this.chatId)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data: Array<DocumentData>) => {
        this.messages = data.sort((m1, m2) => m1.createdAt - m2.createdAt);
        // Scroll down after the DOM is updated
        setTimeout(() => {
          this.messageSection.nativeElement.scrollTop = this.messageSection.nativeElement.scrollHeight;
        }, 0);
      });
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => params.get('chatId')),
        switchMap((chatId: string) =>
          this.subService.getSubscribedUsers(chatId)
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((users: any) => {
        console.log(users);
        this.usersArrayToJson(users);
      });
  }

  sendMessage(event: any) {
    event.preventDefault();
    if (this.chatMetadata.type == 'dm') {
      this.subService.addSubscription(this.chatId, this.recipientUser.uid);
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

  trackByCreated(index: number, msg: any) {
    return msg.createdAt;
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

  private usersArrayToJson(usersArray: Array<any>) {
    usersArray.forEach((user) => {
      this.users[user.uid] = user;
    });
  }
}
