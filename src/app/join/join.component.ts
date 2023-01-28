import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {
  getAuth
} from "firebase/auth";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
  getCountFromServer,
  where,serverTimestamp
} from "firebase/firestore";
@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['../home/home.component.scss']
})
export class JoinComponent {
  message: string = '';
  errorMsg: string = '';
  myForm: any = FormGroup;

  constructor(public fb: FormBuilder){
    this.myForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3)]],
      subject: ['',[Validators.required , Validators.minLength(3)]],
      code: ['',[Validators.required , Validators.minLength(3)]],
    });
  }
  async onSubmit(joinForm: any){
    let name: string = joinForm.value.name;
    let subject: string = joinForm.value.subject;
    let classCode: string = joinForm.value.code;
    this.message = "Joining class...";
    this.errorMsg = "";

    let firestore = getFirestore();
    let auth: any  = getAuth();
    let user:any = auth.currentUser;

    let q = query(collection(firestore,"classes"),where("code","==",classCode),where("type","==","teacher"));

    let validClassCode = await getCountFromServer(q);
    if(validClassCode.data().count>0){
      // Execute when class code is valid
      let q = query(collection(firestore,"classes"),where("userid","==",user.uid),where("code","==",classCode));
      let checkAlready = await getCountFromServer(q);
      if(checkAlready.data().count>0){
        this.message = "";
        this.errorMsg = "Already in or requested for the class";
      }else{
        // Adding new user to class
        let id = Math.random().toString(36).substr(2, 12);
        setDoc(doc(firestore,"classes",id),{
          id: id,
          code: classCode,
          dateJoined: serverTimestamp(),
          email:user.email,
          userid: user.uid,
          username: user.displayName,
          name:name,
          subject: subject,
          status: "restrict",
          type:"student",
        }).then(()=>{
          this.errorMsg = "";
          this.message = "Join request sent. Check in requests.";
          
          setTimeout(()=> this.message = "",5000);
          this.myForm.reset();
        }).catch((error)=>{
          this.message = "";
          this.errorMsg = error.message;
        });
      }
    }else{
      this.message = "";
      this.errorMsg = "Class code invalid try again.";
    }
  }
}
