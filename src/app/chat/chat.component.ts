import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { ImageUploadService } from '../services/image-upload.service';
import { SubscriptionService } from '../services/subscription.service';
import { ProfileService } from '../services/profile.service';
import { ChatInfoComponent } from '../chat-info/chat-info.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

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
  chatImageUrl = '';
  chatTitle = '';
  imageUrl: any;
  imageLoading = false;
  messageControl = new FormControl('', [Validators.maxLength(1024)]);
  unsubscribe$: Subject<void> = new Subject<void>();
  recipientUser: any;

  @ViewChild('messageSection', { read: ElementRef })
  public messageSection: ElementRef<any>;
  @ViewChild('inputMessage') inputMessage: ElementRef<HTMLInputElement>;

  constructor(
    private chatService: ChatService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private subService: SubscriptionService,
    private auth: AuthService,
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => params.get('chatId')),
        switchMap((chatId: string) => this.chatService.getChatMetadata(chatId)),
        switchMap((data: any) => {
          this.chatMetadata = data;
          this.chatImageUrl = data?.groupImageUrl;
          this.chatTitle = data?.groupName;
          if (data.type === 'dm') {
            /* Get the other user's ID */
            const myId = this.auth.getUid();
            const recipientId = data.participants.filter(
              (userId: string) => userId !== myId
            )[0];
            return this.chatService.getUser(recipientId);
          } else {
            return of(null);
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data: any) => {
        /* recipientUser is null if selected chat is a group chat */
        this.recipientUser = data;
        /* If data is not null, i.e. it is not a group but DM, assign chatImageUrl and chatTitle */
        this.chatImageUrl = data ? data.profileImage : this.chatImageUrl;
        this.chatTitle = data ? data.displayName : this.chatTitle;
      });
    this.route.paramMap
      .pipe(
        tap((params) => (this.chatId = params.get('chatId'))),
        switchMap(() => this.chatService.getMessages(this.chatId)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data: Array<DocumentData>) => {
        this.profileService.updateLastReadTime(this.chatId);
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
        this.usersArrayToJson(users);
      });
  }

  sendMessage(event: any) {
    event.preventDefault();
    if (this.chatMetadata.type === 'dm' && this.messages.length === 0) {
      this.subService.addSubscription(this.chatId, this.recipientUser.uid);
    }
    if (this.messageControl.value.trim()) {
      this.chatService.sendMessage(
        this.messageControl.value,
        this.chatId,
        'text'
      );
      this.inputMessage.nativeElement.value = '';
      this.messageControl.setValue('');
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
      this.dialog.open(ImageUploadComponent, {
        maxWidth: '90vw',
        autoFocus: false,
        data: {
          croppieOptions: null,
          isCroppedImage: false,
          initalSelectedImage: this.imageUrl,
          recipient: this.chatTitle,
          chatId: this.chatId,
        },
      });
    };

    reader.readAsDataURL(this.selectedImageFile);
  }

  private usersArrayToJson(usersArray: Array<any>) {
    usersArray.forEach((user) => {
      this.users[user.uid] = user;
    });
  }

  onInvite() {
    this.clipboard.copy(
      "You've been invited to join the " +
        this.chatTitle +
        ' group chat through PChat!\n' +
        'Enter the link below to continue:\n' +
        window.location.href
    );
    this._snackBar.open('Invite link copied to clipboard', 'Close', {
      duration: 2000,
    });
  }

  onChatInfo() {
    if (this.chatMetadata.type === 'group') {
      this.dialog.open(ChatInfoComponent, {
        maxWidth: '80vw',
        maxHeight: '90vh',
        data: { chatMetadata: this.chatMetadata, isSubscribed: true },
      });
    }
  }
}
