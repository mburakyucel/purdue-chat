import { Component, OnInit } from '@angular/core';

import { Class, Sub } from '../../assets/class';
import { ClassService } from '../services/class.service';
import { SubsFirestoreService } from '../services/subs-firestore.service'

@Component({
  selector: 'app-class-collection',
  templateUrl: './class-collection.component.html',
  styleUrls: ['./class-collection.component.css']
})
export class ClassColComponent implements OnInit {
  classes: Class[];
  selectedClass: Class;
  subs: Sub[];

  constructor(
    private classService: ClassService,
    private subService: SubsFirestoreService) { }

  ngOnInit() {
    this.getClasses();
    this.subService.getSubs().subscribe(subs => {
      this.subs = subs;
    });
  }

  //Method to retrieve the classes from the service
  getClasses(): void {
    this.classService.getClasses()
    .subscribe(classes => this.classes = classes);
  }

  onSelect(myclass: Class): void {
    this.selectedClass = myclass;
    if(this.subs.length == 0) this.subService.addSub(myclass.CRN);
    else
    { 
      var chk = 0;
      for(let i = 0; i < this.subs.length; i++)
      {
        if(this.subs[i].CRN == myclass.CRN) chk = 1;
      }
      if(chk == 0) this.subService.addSub(myclass.CRN);
    }
  }
}
