import { Component, OnInit } from '@angular/core';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['../created/created.component.scss']
})
export class RequestComponent implements OnInit {
  
  allClasses: any[] = [];

  async getClasses(){
  let firestore = getFirestore();
  let auth:any = getAuth();
  let user:any = auth.currentUser;
  // Getting requested classes by the user
  let querySnapshot = await getDocs(query(collection(firestore,"classes"),where("type","==","student"),where("userid","==",user.uid),where("status","==","restrict")));
  querySnapshot.forEach((doc)=>{
    this.allClasses.push(doc.data());
  });
  }
  ngOnInit(){
    this.getClasses();
  };
  onDelete(){
    this.allClasses = [];
    this.getClasses();
  }
}
