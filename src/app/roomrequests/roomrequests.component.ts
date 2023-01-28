import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
@Component({
  selector: 'app-roomrequests',
  templateUrl: './roomrequests.component.html',
  styleUrls: ['../people/people.component.scss']
})
export class RoomrequestsComponent {
  classId:any;
  allStudents: any[] =[];
  teacher: any[] = [];
  validUser: boolean = false;
  constructor(public activatedRoute: ActivatedRoute){
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
    this.checkValidUser();
    this.getStudentsData();
  }
  async checkValidUser(){
    let firestore = getFirestore();
    let auth:any = getAuth();
    let user:any = auth.currentUser;

    let q = query(collection(firestore,"classes"),where("code","==",this.classId),where("userid","==",user.uid),where("status","==","allow"),where("type","==","teacher"));
    
    if( (await getCountFromServer(q)).data().count>0){
      this.validUser = true;
    }

    
  }
  async getStudentsData(){
    let firestore = getFirestore();
    // Getting students of the class
    let querySnapshot = await getDocs(query(collection(firestore,"classes"),where("type","==","student"),where("code","==",this.classId),where("status","==","restrict")));

    querySnapshot.forEach((doc)=>{
      this.allStudents.push(doc.data());
    });
  }
  
  async addStudent(id: string){
    let firestore = getFirestore();
    updateDoc(doc(firestore,"classes",id),{
      status:"allow",
    }).then(()=>{
      // Refresh the list of students
      this.allStudents = [];
      this.getStudentsData();
    })
  }
}
