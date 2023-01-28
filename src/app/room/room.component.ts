import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  classId:any;
  allClasses: any[] =[];
  classDetail: any ={};
  validUser: boolean = false;
  constructor(public activatedRoute: ActivatedRoute){
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getClassDetails();
  }
  async getClassDetails(){
    let firestore = getFirestore();
    let auth:any = getAuth();
    let user:any = auth.currentUser;
    // Getting Its Details
    let querySnapshot = await getDocs(query(collection(firestore,"classes"),where("userid","==",user.uid),where("code","==",this.classId),where("status","==","allow")));
    querySnapshot.forEach((doc)=>{
      this.allClasses.push(doc.data());
    });
    if(this.allClasses.length>0){
      this.validUser = true;
      this.classDetail = this.allClasses[0];
    }
  }
}
