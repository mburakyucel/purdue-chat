import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HammerModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';

import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { GroupsComponent } from './groups/groups.component';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { MatListModule } from '@angular/material/list';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProfileComponent } from './profile/profile.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { ChatInfoComponent } from './chat-info/chat-info.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { HammerConfig } from './shared/hammer-config';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    SubscriptionsComponent,
    GroupsComponent,
    ChatComponent,
    ChatListComponent,
    ImageUploadComponent,
    ProfileComponent,
    MainComponent,
    HomeComponent,
    ChatInfoComponent,
    CreateGroupComponent,
    ChatListItemComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    TextFieldModule,
    MatListModule,
    MatDialogModule,
    MatCardModule,
    MatSidenavModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    HammerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
