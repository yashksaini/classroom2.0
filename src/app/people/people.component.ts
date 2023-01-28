import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {
  classId:any;
  allStudents: any[] =[];
  teacher: any[] = [];
  validUser: boolean = false;
  IsTeacher: boolean = false;
  constructor(public activatedRoute: ActivatedRoute){
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
    this.checkValidUser();
    this.getStudentsData();
    this.checkTeacher();
  }
  async checkValidUser(){
    let firestore = getFirestore();
    let auth:any = getAuth();
    let user:any = auth.currentUser;

    let q = query(collection(firestore,"classes"),where("code","==",this.classId),where("userid","==",user.uid),where("status","==","allow"));
    
    if( (await getCountFromServer(q)).data().count>0){
      this.validUser = true;
    }

    
  }
  async getStudentsData(){
    let firestore = getFirestore();
    // Getting students of the class
    let querySnapshot = await getDocs(query(collection(firestore,"classes"),where("type","==","student"),where("code","==",this.classId),where("status","==","allow")));

    querySnapshot.forEach((doc)=>{
      this.allStudents.push(doc.data());
    });
  }
  async checkTeacher(){
    let firestore = getFirestore();
    let auth:any = getAuth();
    let user:any = auth.currentUser;

    // Checking for teacher
    let querySnapshot = await getDocs(query(collection(firestore,"classes"),where("type","==","teacher"),where("code","==",this.classId),where("status","==","allow")));

    querySnapshot.forEach((doc)=>{
      this.teacher.push(doc.data());
    });
    if(this.teacher[0].userid===user.uid){
      this.IsTeacher = true;
    }
  }
  async removeStudent(id: string){
    let firestore = getFirestore();
    deleteDoc(doc(firestore,"classes",id)).then(()=>{
      // Refresh the list of students
      this.allStudents = [];
      this.getStudentsData();
    })
  }
}
