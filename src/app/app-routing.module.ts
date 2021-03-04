import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ClassesComponent } from './classes/classes.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth.guard';
import { UnauthGuard } from './unauth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [UnauthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UnauthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
  { path: 'subs', component: SubscriptionsComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'chat', component: MainComponent },
  { path: 'chat/:chatId', component: MainComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
