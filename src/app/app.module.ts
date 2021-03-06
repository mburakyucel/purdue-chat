import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';

import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ClassesComponent } from './classes/classes.component';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { MatListModule } from '@angular/material/list';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProfileComponent } from './profile/profile.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { CreateGroupComponent } from './create-group/create-group.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    SubscriptionsComponent,
    ClassesComponent,
    ChatComponent,
    ChatListComponent,
    ImageUploadComponent,
    ProfileComponent,
    MainComponent,
    HomeComponent,
    CreateGroupComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
