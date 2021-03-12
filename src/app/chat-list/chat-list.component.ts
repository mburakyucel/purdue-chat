import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  chats: Array<any>;
  chatIds: Array<string>;
  @Output() chatSelect = new EventEmitter();
  subscription: Subscription;
  constructor(public chatService: ChatService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((data) => {
      this.chatIds = data.chats;
    })
    this.chatService
      .getChatMetadatas()
      .subscribe((chatDocuments: Array<any>) => {
        this.chats = chatDocuments;
      });
  }

  onChatSelect(chatId: string) {
    this.chatSelect.emit(chatId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
