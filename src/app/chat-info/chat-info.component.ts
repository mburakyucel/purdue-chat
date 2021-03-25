import { Component, OnInit, Inject} from '@angular/core';
import { SubscriptionService } from '../services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { CreateGroupService } from '../services/create-group.service';
import { Router } from '@angular/router';
import { GroupsComponent } from '../groups/groups.component';


@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css'],
})
export class ChatInfoComponent implements OnInit {
  chatMembers: any[] = [];
  docDmId:any;
  revDocDmId:any;

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public groupService: CreateGroupService,
    private router: Router,
    public dialogRef: MatDialogRef<GroupsComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedGroup: any
  ) {}

  ngOnInit(): void {
    this.subService
      .getSubscribedUsers(this.selectedGroup.id)
      .subscribe((userData) => (this.chatMembers = userData));
  }

  onJoin(): void {
    this.subService
      .addSubscription(this.selectedGroup.id, this.authService.getUid())
      .then(() => {
        this._snackBar.open(
          `Subscribed to ${this.selectedGroup.groupName}`,
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

  sendDM(user:any){
    const myId = this.authService.getUid()
    const participants = new Array(myId, user.uid).sort()
    this.docDmId = participants[0] + '_' + participants[1];

    console.log(participants)
    console.log(user.uid)
    console.log(this.docDmId)

    this.groupService.queryDm(this.docDmId).subscribe((docDm) => {
      if(!docDm.exists){
        this.groupService.createDm(this.docDmId, participants).then(() => {
          this.subService.addSubscription(this.docDmId, myId);
          this.router.navigate([`/chat/${this.docDmId}`]);
          this.dialogRef.close()
        })
      }
      else{
        this.subService.addSubscription(this.docDmId, myId);
        this.router.navigate([`/chat/${this.docDmId}`]);
        this.dialogRef.close()
      }
    })
  }
}
