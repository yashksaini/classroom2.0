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
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.scss']
})
export class CreatedComponent implements OnInit {
  
  allClasses: any[] = [];

  async getClasses(){
  let firestore = getFirestore();
  let auth:any = getAuth();
  let user:any = auth.currentUser;
  // Getting created classes by the user
  let querySnapshot = await getDocs(query(collection(firestore,"classes"),where("type","==","teacher"),where("userid","==",user.uid)));
  querySnapshot.forEach((doc)=>{
    this.allClasses.push(doc.data());
  });
  }
  ngOnInit(){
    this.getClasses();
  };
}
