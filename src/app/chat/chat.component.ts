import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  chatId: string;
  messages$: any;
  messages: any[] = [];
  messageControl = new FormControl('');
  @ViewChild("inputMessage") inputMessage: ElementRef<HTMLInputElement>;
  constructor(
    public chatService: ChatService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.messages$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.chatId = params.get('chatId');
        return this.chatService.getMessages(this.chatId);
      })
    );
    this.messages$.subscribe((data: Array<DocumentData>) => {
      console.log(data);
      this.messages = data.sort((m1, m2) => m1.createdAt - m2.createdAt);
    })
  }

  sendMessage() {
    if(this.messageControl.value.trim()) {
      this.chatService.sendMessage(this.messageControl.value, this.chatId);
      this.inputMessage.nativeElement.value = '';
      this.messageControl.setValue('');
      console.log("Sent");
    }
  }

  onChatSelect(chatId: string) {
    this.router.navigate([`/chat/${chatId}`]);
  }

  ngOnDestroy() {
    console.log("onDestroy");
  }

}
