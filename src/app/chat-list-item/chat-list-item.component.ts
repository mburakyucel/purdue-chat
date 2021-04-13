import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { ProfileService } from '../services/profile.service';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.css'],
})
export class ChatListItemComponent implements OnInit {
  @Input() chatId: string;
  @Output() chatSelect = new EventEmitter<string>();
  @Output() lastMessageTime$ = new EventEmitter<{
    chatId: string;
    lastMessageTime: number;
  }>();
  readonly MESSAGE_LIMIT = 20;
  chatMetadata: any;
  messages: any[] = [];
  lastMessage: any;
  users: any = {};
  myId = this.authService.getUid();
  dmRecipient: any;
  imageUrl = '';
  chatTitle = '';
  isRecipientSubscribed = false;
  lastReadTime = Infinity;
  unreadCount = 0;
  // unreadLabel is either unreadCount or unreadCount+ as string
  unreadLabel = '';

  constructor(
    private chatService: ChatService,
    private subService: SubscriptionService,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('chat-list-item init');
    this.chatService.getChatMetadata(this.chatId).subscribe((data: any) => {
      this.chatMetadata = data;
      /* imageUrl and chatTitle will get assigned null if it is a DM */
      this.imageUrl = data?.groupImageUrl;
      this.chatTitle = data?.groupName;
      /* Subscribe to the recipient only once by checking the isRecipientSubscribed */
      if (!this.isRecipientSubscribed && data.type === 'dm') {
        this.isRecipientSubscribed = true;
        /* Get the other user's ID */
        const recipientId = data.participants.filter(
          (userId: string) => userId !== this.myId
        )[0];
        this.chatService.getUser(recipientId).subscribe((user: any) => {
          this.dmRecipient = user;
          this.imageUrl = user.profileImage;
          this.chatTitle = user.displayName;
        });
      }
    });
    this.chatService
      .getMessagesWithLimit(this.chatId, this.MESSAGE_LIMIT)
      .subscribe(
        (messages: Array<any>) => {
          if (messages.length) {
            this.lastMessage = messages[0];
            this.messages = messages;
            this.setNotificationCount();
            this.lastMessageTime$.emit({
              chatId: this.chatId,
              lastMessageTime: this.lastMessage.createdAt,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    this.subService.getSubscribedUsers(this.chatId).subscribe((users) => {
      this.usersArrayToJson(users);
    });
    this.profileService
      .getLastReadTime(this.chatId)
      .subscribe((time: number) => {
        this.lastReadTime = time;
        this.setNotificationCount();
      });
  }

  onClick() {
    this.chatSelect.emit(this.chatId);
  }

  private setNotificationCount() {
    let count = 0;
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].createdAt < this.lastReadTime) {
        break;
      }
      count++;
    }
    this.unreadCount = count;
    /* Because this component's activatedRoute doesn't contain the chatId route variable, check from the absolute url */
    if(this.router.url.includes(this.chatId)) {
      this.unreadLabel = '';
    } else {
      this.unreadLabel =
      this.unreadCount >= this.MESSAGE_LIMIT
        ? `${this.unreadCount}+`
        : `${this.unreadCount}`;
    }
  }

  private usersArrayToJson(usersArray: Array<any>) {
    usersArray.forEach((user) => {
      this.users[user.uid] = user;
    });
  }
}
