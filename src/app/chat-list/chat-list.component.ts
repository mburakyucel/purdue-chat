import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  chats: Array<any>;
  @Output() chatSelect = new EventEmitter();
  subscription: Subscription;
  constructor(public chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getChatMetadatas().subscribe((chatDocuments: Array<any>) => {
      this.chats = chatDocuments;
    })
  }

  onChatSelect(chatId: string) {
    this.chatSelect.emit(chatId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
