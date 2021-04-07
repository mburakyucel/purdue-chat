import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { SubscriptionService } from '../services/subscription.service';

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
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.subscriptionService.getSubscriptions()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((chatIds: string[]) => {
        this.chatIds = chatIds;
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
