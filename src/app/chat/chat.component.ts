import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  messageControl = new FormControl('');
  subs: Subscription;
  @ViewChild("inputMessage") inputMessage: ElementRef<HTMLInputElement>;
  constructor(
    public chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.subs = this.chatService.getMessages('8YInfRqTJccFbh8FmlqR').subscribe(data => {
      console.log(data);
      this.messages = data.sort((m1, m2) => m1.createdAt - m2.createdAt);
    });
  }

  sendMessage() {
    if(this.messageControl.value.trim()) {
      this.chatService.sendMessage(this.messageControl.value);
      this.inputMessage.nativeElement.value = '';
      this.messageControl.setValue('');
      console.log("Sent");
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
