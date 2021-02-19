import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SubListComponent } from './sub-list/sub-list.component';
import { ClassColComponent } from './class-collection/class-collection.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'subs', component: SubListComponent },
  { path: 'classes', component: ClassColComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:chatId', component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
