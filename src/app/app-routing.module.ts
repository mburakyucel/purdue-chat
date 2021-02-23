import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
<<<<<<< HEAD
import { CropComponent } from './crop/crop.component';
=======
import { ProfilepageComponent } from './profilepage/profilepage.component';
>>>>>>> efa9dc793509bc2b5ed41ee471398343cd96ebb5

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
<<<<<<< HEAD
=======
  { path: 'profilepage', component: ProfilepageComponent },
>>>>>>> efa9dc793509bc2b5ed41ee471398343cd96ebb5
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:chatId', component: ChatComponent },
  { path: 'crop', component: CropComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
