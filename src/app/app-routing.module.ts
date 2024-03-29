import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { GroupsComponent } from './groups/groups.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { ChatGuard } from './guards/chat.guard';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [UnauthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UnauthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
  { path: 'subs', component: SubscriptionsComponent },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'groups',
        component: GroupsComponent,
      },
      {
        path: 'chat/:chatId',
        canActivate: [ChatGuard],
        component: ChatComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
