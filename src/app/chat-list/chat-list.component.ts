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
  @Output() chatSelect = new EventEmitter();
  chatItems: Array<any> = [];
  unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    public chatService: ChatService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.subscriptionService
      .getSubscriptions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((chatIds: string[]) => {
        /* Cannot assign the new items directly. Operations need to be done in place
         * to avoid reconstructing the chat-list-items.
         * First, remove the elements that doesn't exist in the returned result.
         */
        this.chatItems.forEach(({chatId, lastMessageTime}, index) => {
          if(!chatIds.includes(chatId)) {
            this.chatItems.splice(index, 1);
          }
        })
        chatIds.forEach((chatId) => {
          /* Set the last message time to infinity initially
             Push the item into the array if it is unique
          */
          if (!this.isChatIdExist(chatId)) {
            this.chatItems.push({ chatId, lastMessageTime: Infinity });
          }
        });
      });
  }

  onChatSelect(chatId: string) {
    this.chatSelect.emit(chatId);
  }

  updateLastMessageTime({
    chatId,
    lastMessageTime,
  }: {
    chatId: string;
    lastMessageTime: number;
  }) {
    for (let i = 0; i < this.chatItems.length; i++) {
      if (this.chatItems[i].chatId === chatId) {
        this.chatItems[i].lastMessageTime = lastMessageTime;
        break;
      }
    }
    this.sortChatListItems();
  }

  sortChatListItems() {
    this.chatItems.sort(
      (a: any, b: any) => b.lastMessageTime - a.lastMessageTime
    );
  }

  isChatIdExist(chatId: string) {
    for (let i = 0; i < this.chatItems.length; i++) {
      if (this.chatItems[i].chatId === chatId) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
