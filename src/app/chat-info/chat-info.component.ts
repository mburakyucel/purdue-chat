import { Component, OnInit, Inject } from '@angular/core';
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
  dmDocId: any;
  chatMetadata: any;
  isSubscribed: boolean;

  constructor(
    private subService: SubscriptionService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public cgService: CreateGroupService,
    private router: Router,
    public dialogRef: MatDialogRef<GroupsComponent>,
    @Inject(MAT_DIALOG_DATA) public chatInfoDialogData: any
  ) {}

  ngOnInit(): void {
    this.chatMetadata = this.chatInfoDialogData.chatMetaData;
    this.isSubscribed = this.chatInfoDialogData.isSubscribed;
    this.subService
      .getSubscribedUsers(this.chatMetadata.id)
      .subscribe((userData) => (this.chatMembers = userData));
  }

  onJoin(): void {
    this.subService
      .addSubscription(this.chatMetadata.id, this.authService.getUid())
      .then(() => {
        this.router.navigate([`/chat/${this.chatMetadata.id}`]);
        this._snackBar.open(
          `Subscribed to ${this.chatMetadata.groupName}`,
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

  sendDM(user: any) {
    const myId = this.authService.getUid();
    const participants = [myId, user.uid].sort();
    this.dmDocId = `${participants[0]}_${participants[1]}`;

    this.cgService.getDmMetadata(this.dmDocId).subscribe(async (docDm) => {
      if (!docDm.exists) {
        await this.cgService.createDm(this.dmDocId, participants);
      }
      await this.subService.addSubscription(this.dmDocId, myId);
      this.router.navigate([`/chat/${this.dmDocId}`]);
      this.dialogRef.close();
    });
  }

  unSubscribe() {
    if (this.isSubscribed) {
      this.subService.removeSubscription(this.chatMetadata.id);

      //If router is not at /groups page then navigate back to home
      if (this.router.routerState.snapshot.url != '/groups') {
        this.router.navigate([``]);
      }
    }
  }
}
