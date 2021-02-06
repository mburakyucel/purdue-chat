import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  messages: any[] = [];
  message = new FormControl('');
  subs: Subscription;
  constructor(public chatService: ChatService) { }

  ngOnInit(): void {
    this.subs = this.chatService.getMessages('8YInfRqTJccFbh8FmlqR').subscribe(data => {
      console.log(data);
      this.messages = data;
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.message.value);
    console.log("Sent");
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
