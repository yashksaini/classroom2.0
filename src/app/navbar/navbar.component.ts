import { Component } from '@angular/core';
import {
  getAuth,signOut
} from "firebase/auth";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  toggle: boolean = false;
  addBar:boolean = false;
  profileBar: boolean = false;
  auth: any  = getAuth();
  user: any = this.auth.currentUser;
  toggleNav(){
    // closing the add bar if open
    this.addBar = false;
    this.profileBar = false;
    this.toggle = !this.toggle;
  }
  createJoin(){
    // for closing navbar if open
    this.toggle = false;
    this.profileBar = false;
    this.addBar = !this.addBar;
  }
  toggleProfile(){
    this.addBar = false;
    this.toggle = false;
    this.profileBar = !this.profileBar;
  }
  logOutUser(){
    signOut(this.auth).then(()=>{
      console.log("Logged out");
    })
  }
}
