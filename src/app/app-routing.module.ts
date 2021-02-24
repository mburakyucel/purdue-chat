import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ClassesComponent } from './classes/classes.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'subs', component: SubscriptionsComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:chatId', component: ChatComponent },
  { path: 'imageUpload', component: ImageUploadComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
