import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
})
export class AssignmentComponent {
  classId: any;
  allClasses: any[] = [];
  allAssignments: any[] = [];
  classDetail: any = {};
  validUser: boolean = false;
  myForm: any = FormGroup;
  date: any;

  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder) {
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getClassDetails();
    this.getAssignments();
    this.date = new Date().toJSON().slice(0, 10);
    this.myForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', [Validators.required]],
      desc: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit(assignmentForm: any) {
    let title: string = assignmentForm.value.title;
    let date: string = assignmentForm.value.date;
    let desc: string = assignmentForm.value.desc;

    let firestore = getFirestore();
    let auth: any = getAuth();
    let user: any = auth.currentUser;

    let assignmentId = Math.random().toString(36).substr(2, 12);
    setDoc(doc(firestore, 'assignments', assignmentId), {
      id: assignmentId,
      code: this.classId,
      addedOn: serverTimestamp(),
      title: title,
      dueDate: date,
      desc: desc,
      owner: user.uid,
    }).then(() => {
      // Refresh the list of content
      this.allAssignments = [];
      this.getAssignments();
      this.myForm.reset();
    });
  }
  async getAssignments() {
    let firestore = getFirestore();
    let querySnapshot = await getDocs(
      query(
        collection(firestore, 'assignments'),
        where('code', '==', this.classId),
        orderBy('addedOn', 'desc')
      )
    );
    querySnapshot.forEach((doc) => {
      this.allAssignments.push(doc.data());
    });
  }
  async getClassDetails() {
    let firestore = getFirestore();
    let auth: any = getAuth();
    let user: any = auth.currentUser;
    // Getting created classes by the user
    let querySnapshot = await getDocs(
      query(
        collection(firestore, 'classes'),
        where('userid', '==', user.uid),
        where('code', '==', this.classId),
        where('status', '==', 'allow')
      )
    );
    querySnapshot.forEach((doc) => {
      this.allClasses.push(doc.data());
    });
    if (this.allClasses.length > 0) {
      this.validUser = true;
      this.classDetail = this.allClasses[0];
    }
  }
  async deleteContent(id: string) {
    let firestore = getFirestore();
    deleteDoc(doc(firestore, 'assignments', id)).then(() => {
      // Refresh the list of content
      this.allAssignments = [];
      this.getAssignments();
    });
  }
}
