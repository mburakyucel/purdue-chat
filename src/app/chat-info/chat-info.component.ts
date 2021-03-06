import { Component, OnInit} from '@angular/core';

import { Class } from '../../assets/class';
import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css']
})
export class ChatInfoComponent implements OnInit {
  selectedClassId: string = '';
  selectedClassInfo: Class;
  allClasses: Class[] = [];

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subService.currentSelectedClass.subscribe(Class => this.selectedClassId = Class)
    this.subService.getClasses().subscribe((classes) => this.allClasses = classes);
  }

  //Function that return the description of the selected class
  findClassInfo(): string {
    for(let item of this.allClasses) {
      if (item.id == this.selectedClassId) {
        this.selectedClassInfo = item;
        return item.description
      }
    }
    return ''
  }

  onJoinSelectInDialog(): void {
    this.subService
      .addSubscription(this.selectedClassId)
      .then(() => {
        this._snackBar.open(
          `Subscribed to ${this.selectedClassInfo.subject} ${this.selectedClassInfo.course}`,
          'Close',
          {
            duration: 2000,
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
