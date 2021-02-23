import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CropComponent } from './crop/crop.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:chatId', component: ChatComponent },
  { path: 'crop', component: CropComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
