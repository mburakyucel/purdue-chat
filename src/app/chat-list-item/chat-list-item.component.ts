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
  myId:any;

  constructor(
    private chatService: ChatService,
    private subService: SubscriptionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chatService.getChatMetadata(this.chatId).subscribe((data: any) => {
      this.chatMetadata = data;
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
    this.myId = this.authService.getUid()
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
