import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.css'],
})
export class ChatListItemComponent implements OnInit {
  @Input() chatId: string;
  @Output() chatSelect = new EventEmitter<string>();
  chatMetadata: any;
  lastMessage: any;
  users: any = {};
  myId = this.authService.getUid();
  dmRecipient: any;
  imageUrl = '';
  isRecipientSubscribed = false;

  constructor(
    private chatService: ChatService,
    private subService: SubscriptionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chatService.getChatMetadata(this.chatId).subscribe((data: any) => {
      this.chatMetadata = data;
      /* imageUrl will get assigned null if it is a DM */
      this.imageUrl = data?.groupImageUrl;
      /* Subscribe to the recipient only once by checking the isRecipientSubscribed */
      if (!this.isRecipientSubscribed && data.type == 'dm') {
        this.isRecipientSubscribed = true;
        this.subService
          .getDmRecipient(this.myId, data.participants)
          .subscribe((user: any) => {
            this.dmRecipient = user;
            this.imageUrl = user.profileImage;
          });
      }
    });
    this.chatService.getMessagesWithLimit(this.chatId, 1).subscribe(
      (data: Array<any>) => {
        if (data.length) {
          this.lastMessage = data[0];
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.subService.getSubscribedUsers(this.chatId).subscribe((users) => {
      this.usersArrayToJson(users);
    });
  }

  onClick() {
    this.chatSelect.emit(this.chatId);
  }

  private usersArrayToJson(usersArray: Array<any>) {
    usersArray.forEach((user) => {
      this.users[user.uid] = user;
    });
  }
}
