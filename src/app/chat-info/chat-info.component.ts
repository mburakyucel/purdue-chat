import { Component, OnInit} from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css']
})
export class ChatInfoComponent implements OnInit {
  selectedClass: string = '';
  allClasses: Class[] = [];

  constructor(
    private subService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.subService.currentSelectedClass.subscribe(Class => this.selectedClass = Class)
    this.subService.getClasses().subscribe((classes) => this.allClasses = classes);
  }

  //Function that return the description of the selected class
  findClassInfo(): string {
    for(let item of this.allClasses) {
      if (item.id == this.selectedClass) {
        return item.description
      }
    }
    return ''
  }
}
