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
  getCountFromServer,
  where,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
@Component({
  selector: 'app-viewassignment',
  templateUrl: './viewassignment.component.html',
  styleUrls: ['./viewassignment.component.scss'],
})
export class ViewassignmentComponent {
  classId: any;
  allClasses: any[] = [];
  allAssignments: any[] = [];
  allSubmits: any[] = []; // Used for teacher
  allSubmitDetails: any[] = []; // Used for student
  submitDetail: any = {};
  assignmentDetail: any = {};
  classDetail: any = {};
  validUser: boolean = false;
  myForm: any = FormGroup;

  assignmentId: any;

  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder) {
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
    this.assignmentId =
      this.activatedRoute.snapshot.paramMap.get('assignmentId');
    this.getClassDetails();
    this.getAssignmentDetails();
    this.getSubmitDetails();
    this.getAllSubmits();
    this.myForm = this.fb.group({
      link: ['', [Validators.required, Validators.minLength(3)]],
      desc: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit(assignmentForm: any) {
    let link: string = assignmentForm.value.link;
    let desc: string = assignmentForm.value.desc;

    let firestore = getFirestore();
    let auth: any = getAuth();
    let user: any = auth.currentUser;

    let submitId = Math.random().toString(36).substr(2, 12);
    setDoc(doc(firestore, 'submits', submitId), {
      id: submitId,
      code: this.classId,
      addedOn: serverTimestamp(),
      assignmentId: this.assignmentId,
      link: link,
      desc: desc,
      owner: user.uid,
      name: user.displayName,
      email: user.email,
    }).then(() => {
      // Refresh the assignment
      this.allSubmitDetails = [];
      this.getSubmitDetails();
      this.myForm.reset();
    });
  }
  async getAssignmentDetails() {
    let firestore = getFirestore();
    let querySnapshot = await getDocs(
      query(
        collection(firestore, 'assignments'),
        where('id', '==', this.assignmentId)
      )
    );
    querySnapshot.forEach((doc) => {
      this.allAssignments.push(doc.data());
    });
    if (this.allAssignments.length > 0) {
      this.assignmentDetail = this.allAssignments[0];
    }
  }
  async getSubmitDetails() {
    let firestore = getFirestore();
    let auth: any = getAuth();
    let user: any = auth.currentUser;
    let querySnapshot = await getDocs(
      query(
        collection(firestore, 'submits'),
        where('owner', '==', user.uid),
        where('assignmentId', '==', this.assignmentId)
      )
    );
    querySnapshot.forEach((doc) => {
      this.allSubmitDetails.push(doc.data());
    });
    if (this.allSubmitDetails.length > 0) {
      this.submitDetail = this.allSubmitDetails[0];
    }
  }
  async getAllSubmits() {
    let firestore = getFirestore();
    let querySnapshot = await getDocs(
      query(
        collection(firestore, 'submits'),
        where('assignmentId', '==', this.assignmentId)
      )
    );
    querySnapshot.forEach((doc) => {
      this.allSubmits.push(doc.data());
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
  async removeAssignment(id: string) {
    let firestore = getFirestore();
    deleteDoc(doc(firestore, 'submits', id)).then(() => {
      // Refresh the assignment
      this.allSubmitDetails = [];
      this.getSubmitDetails();
    });
  }
}
