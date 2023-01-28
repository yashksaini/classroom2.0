import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {
  getAuth
} from "firebase/auth";

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  query,
  getCountFromServer,
  where,serverTimestamp, orderBy
} from "firebase/firestore";
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  classId:any;
  allClasses: any[] =[];
  allContent: any[] = [];
  classDetail: any ={};
  validUser: boolean = false;
  myForm: any = FormGroup;
  
  constructor(public activatedRoute: ActivatedRoute,public fb: FormBuilder){
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getClassDetails();
    this.getContent();

    this.myForm = this.fb.group({
      title: ['',[Validators.required, Validators.minLength(3)]],
      link: ['',[Validators.required , Validators.minLength(6)]],
    });
    
  }
  onSubmit(contentForm: any){
    let title: string = contentForm.value.title;
    let link: string = contentForm.value.link;

    let firestore = getFirestore();
    let auth: any  = getAuth();
    let user:any = auth.currentUser;

    let contentId = Math.random().toString(36).substr(2, 12);
    setDoc(doc(firestore,"contents",contentId),{
      id: contentId,
      code: this.classId,
      addedOn: serverTimestamp(),
      title: title,
      link: link,
      owner: user.uid,
    }).then(()=>{
      // Refresh the list of content
      this.allContent = [];
      this.getContent();
      this.myForm.reset();
    });
  }
  async getContent(){
    let firestore = getFirestore();
    let querySnapshot = await getDocs(query(collection(firestore,"contents"),where("code","==",this.classId),orderBy("addedOn","desc")));
    querySnapshot.forEach((doc)=>{
      this.allContent.push(doc.data());
    });
  }
  async getClassDetails(){
    let firestore = getFirestore();
    let auth:any = getAuth();
    let user:any = auth.currentUser;
    // Getting created classes by the user
    let querySnapshot = await getDocs(query(collection(firestore,"classes"),where("userid","==",user.uid),where("code","==",this.classId),where("status","==","allow")));
    querySnapshot.forEach((doc)=>{
      this.allClasses.push(doc.data());
    });
    if(this.allClasses.length>0){
      this.validUser = true;
      this.classDetail = this.allClasses[0];
    }
  }
  async deleteContent(id: string){
    let firestore = getFirestore();
    deleteDoc(doc(firestore,"contents",id)).then(()=>{
      // Refresh the list of content
      this.allContent = [];
      this.getContent();
    })
  }
}
