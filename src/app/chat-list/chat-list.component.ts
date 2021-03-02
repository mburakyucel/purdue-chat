import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  chats: Array<string>;
  @Output() chatSelect = new EventEmitter();
  subscription: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((data) => {
      console.log(data);
      if (data) {
        this.chats = data.chats;
      }
    });
  }

  onChatSelect(chatId: string) {
    this.chatSelect.emit(chatId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
