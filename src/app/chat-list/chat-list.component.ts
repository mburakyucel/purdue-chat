import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  chatIds: Array<string>;
  @Output() chatSelect = new EventEmitter();
  unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    public chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        takeUntil(this.unsubscribe$),
        takeWhile((val) => !!val)
      )
      .subscribe((data) => {
        this.chatIds = data.chats;
      });
  }

  onChatSelect(chatId: string) {
    this.chatSelect.emit(chatId);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
