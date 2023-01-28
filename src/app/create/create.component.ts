import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {
  getAuth,
} from "firebase/auth";

import { doc, setDoc, getFirestore, serverTimestamp } from "firebase/firestore";
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['../home/home.component.scss']
})
export class CreateComponent {
  message: string = '';
  errorMsg: string = '';
  myForm: any = FormGroup;

  constructor(public fb: FormBuilder){
    this.myForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3)]],
      subject: ['',[Validators.required , Validators.minLength(3)]],
    });
  }
  onSubmit(createFrom: any){
    let name: string = createFrom.value.name;
    let subject: string = createFrom.value.subject;
    this.message = "Creating class...";
    this.errorMsg = "";
    let auth: any  = getAuth();
    let user:any = auth.currentUser;
    let firestore = getFirestore();
    let cCode = Math.random().toString(36).substr(2, 6);
    setDoc(doc(firestore,"classes",cCode),{
      id: cCode,
      code: cCode,
      dateJoined: serverTimestamp(),
      email:user.email,
      userid: user.uid,
      username: user.displayName,
      name:name,
      subject: subject,
      status: "allow",
      type:"teacher",
    }).then(()=>{
      this.errorMsg = "";
      this.message = "Class created successfully";
      setTimeout(()=> this.message = "",5000);
      this.myForm.reset();
    }).catch((error)=>{
      this.message = "";
      this.errorMsg = error.message;
    });
  }
}
