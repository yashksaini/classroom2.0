import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";

import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  message: string = '';
  errorMsg: string = '';
  myForm: any = FormGroup;

  constructor(public fb: FormBuilder, public router: Router){
    this.myForm = this.fb.group({
      email: ['',[Validators.required]],
      password: ['',[Validators.required , Validators.minLength(6)]],
    });
    let auth: any = getAuth();
    onAuthStateChanged(auth,(user)=>{
      if(user){
        this.router.navigate(['/h']);
      }else {
        this.router.navigate(['/home']);
      }
    });
  }
  onSubmit(loginForm: any){
    let email: string = loginForm.value.email;
    let password: string = loginForm.value.password;
    this.message = "Logging in...";
    this.errorMsg = "";
    let auth:any = getAuth();
    signInWithEmailAndPassword(auth,email,password).then(()=>{
      this.message = "Logged in successfully";
      this.myForm.reset();
      this.router.navigate(['/h']);
    }).catch((error)=>{
      this.message = "";
      this.errorMsg = error.message;
    })
  }
}
