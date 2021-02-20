import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  chats: Array<string>;
  @Output() chatSelect = new EventEmitter();
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((data) => {
      console.log(data);
      if(data.chats.length > 0 && data != null) this.chats = data.chats;
    });
  }

  onChatSelect(chatId: string) {
    this.chatSelect.emit(chatId);
  }
}
