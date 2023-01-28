import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { HComponent } from './h/h.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateComponent } from './create/create.component';
import { JoinComponent } from './join/join.component';
import { CreatedComponent } from './created/created.component';
import { ClassComponent } from './class/class.component';
import { JoinedComponent } from './joined/joined.component';
import { RequestComponent } from './request/request.component';
import { RoomComponent } from './room/room.component';
import { RoomnavComponent } from './roomnav/roomnav.component';
import { PeopleComponent } from './people/people.component';
import { ContentComponent } from './content/content.component';
import { RoomrequestsComponent } from './roomrequests/roomrequests.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { NoticeComponent } from './notice/notice.component';
import { ViewassignmentComponent } from './viewassignment/viewassignment.component';

const firebaseConfig = {
};

// Initialize Firebase
initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    HComponent,
    NavbarComponent,
    CreateComponent,
    JoinComponent,
    CreatedComponent,
    ClassComponent,
    JoinedComponent,
    RequestComponent,
    RoomComponent,
    RoomnavComponent,
    PeopleComponent,
    ContentComponent,
    RoomrequestsComponent,
    AssignmentComponent,
    NoticeComponent,
    ViewassignmentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
