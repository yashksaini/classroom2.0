import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { Router } from '@angular/router';
import { doc, setDoc, getFirestore, serverTimestamp } from "firebase/firestore";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    message: string = '';
    errorMsg: string = '';
    myForm: any = FormGroup;

    constructor(public fb: FormBuilder, public router: Router){
      this.myForm = this.fb.group({
        fullName: ['',[Validators.required]],
        email: ['',[Validators.required]],
        password: ['',[Validators.required , Validators.minLength(6)]],
      });
      let auth: any = getAuth();
      onAuthStateChanged(auth,(user)=>{
        if(user){
          this.router.navigate(['/h']);
        }else {
          this.router.navigate(['/signup']);
        }
      });
    }
    onSubmit(signupForm: any){
      let fullName: string = signupForm.value.fullName;
      let email: string = signupForm.value.email;
      let password: string = signupForm.value.password;
      this.message = "Signing up...";
      this.errorMsg = "";

      let auth: any  = getAuth();
      createUserWithEmailAndPassword(auth,email,password).then(()=>{
        let currentUser:any = auth.currentUser;
        let firestore = getFirestore();
        updateProfile(currentUser,{
          displayName: fullName,
        });
        
        setDoc(doc(firestore,"profile",currentUser.uid),{
          dateJoined: serverTimestamp(),
          email:email,
          id: currentUser.uid,
          name:fullName,
        }).then(()=>{
          // Data inserted successfully
          this.errorMsg = "";
          this.message = "Successfully signed up please login";
          signOut(auth).then(()=>{
            this.myForm.reset();
          })
        })
      }).catch((error)=>{
        // If signup failed
        this.message = "";
        this.errorMsg = error.message;
      });
    }
}
