import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.css']
})
export class ChatListItemComponent implements OnInit {
  @Input() chatId: string;
  @Output() chatSelect = new EventEmitter<string>();
  chatMetadata: any;
  lastMessage: string;
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.getChatMetadata(this.chatId).subscribe((data: any) => {
      this.chatMetadata = data;
      console.log(data);
    });
    this.chatService.getMessagesWithLimit(this.chatId, 1).subscribe((data: Array<any>) => {
      if(data.length) {
        this.lastMessage = data[0].message;
      }
      console.log(data);
    },
    (error) => {
      console.log(error);
    });
  }

  onClick() {
    this.chatSelect.emit(this.chatId);
  }

}
