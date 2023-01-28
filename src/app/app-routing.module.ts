import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HComponent } from './h/h.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';

import { AuthGuard } from './auth.guard';
import { CreateComponent } from './create/create.component';
import { JoinComponent } from './join/join.component';
import { CreatedComponent } from './created/created.component';
import { JoinedComponent } from './joined/joined.component';
import { RequestComponent } from './request/request.component';
import { RoomComponent } from './room/room.component';
import { PeopleComponent } from './people/people.component';
import { ContentComponent } from './content/content.component';
import { RoomrequestsComponent } from './roomrequests/roomrequests.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { NoticeComponent } from './notice/notice.component';
import { ViewassignmentComponent } from './viewassignment/viewassignment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'h',
    component: HComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'join',
    component: JoinComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'created',
    component: CreatedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'joined',
    component: JoinedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'request',
    component: RequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'room',
    children: [
      {
        path: ':id/people',
        component: PeopleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id/content',
        component: ContentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id/assignments',
        component: AssignmentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id/notices',
        component: NoticeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id/requests',
        component: RoomrequestsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id/view/:assignmentId',
        component: ViewassignmentComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
