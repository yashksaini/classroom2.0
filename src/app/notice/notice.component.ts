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
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent {
  classId: any;
  allClasses: any[] = [];
  allNotices: any[] = [];
  classDetail: any = {};
  validUser: boolean = false;
  myForm: any = FormGroup;

  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder) {
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getClassDetails();
    this.getNotices();

    this.myForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(2)]],
    });
  }
  onSubmit(noticeForm: any) {
    let message: string = noticeForm.value.message;

    let firestore = getFirestore();
    let auth: any = getAuth();
    let user: any = auth.currentUser;

    let noticeId = Math.random().toString(36).substr(2, 12);
    setDoc(doc(firestore, 'notices', noticeId), {
      id: noticeId,
      code: this.classId,
      addedOn: serverTimestamp(),
      message: message,
      owner: user.uid,
    }).then(() => {
      // Refresh the list of content
      this.allNotices = [];
      this.getNotices();
      this.myForm.reset();
    });
  }
  async getNotices() {
    let firestore = getFirestore();
    let querySnapshot = await getDocs(
      query(
        collection(firestore, 'notices'),
        where('code', '==', this.classId),
        orderBy('addedOn', 'desc')
      )
    );
    querySnapshot.forEach((doc) => {
      this.allNotices.push(doc.data());
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
    deleteDoc(doc(firestore, 'notices', id)).then(() => {
      // Refresh the list of content
      this.allNotices = [];
      this.getNotices();
    });
  }
}
