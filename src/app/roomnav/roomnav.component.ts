import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
@Component({
  selector: 'app-roomnav',
  templateUrl: './roomnav.component.html',
  styleUrls: ['./roomnav.component.scss'],
})
export class RoomnavComponent {
  classId: any;
  teacher: any[] = [];
  isTeacher: boolean = false;
  countPeople: any = 0;
  countContent: any = 0;
  countRequest: any = 0;
  countAssignment: any = 0;
  countNotice: any = 0;
  constructor(public activatedRoute: ActivatedRoute) {
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPeopleCount();
    this.getContentCount();
    this.getRequestCount();
    this.getAssignmentCount();
    this.getNoticesCount();
    this.checkTeacher();
  }
  async getPeopleCount() {
    let firestore = getFirestore();
    let q = query(
      collection(firestore, 'classes'),
      where('code', '==', this.classId),
      where('type', '==', 'student'),
      where('status', '==', 'allow')
    );
    this.countPeople = (await getCountFromServer(q)).data().count;
  }
  async getContentCount() {
    let firestore = getFirestore();
    let q = query(
      collection(firestore, 'contents'),
      where('code', '==', this.classId)
    );
    this.countContent = (await getCountFromServer(q)).data().count;
  }
  async getRequestCount() {
    let firestore = getFirestore();
    let q = query(
      collection(firestore, 'classes'),
      where('code', '==', this.classId),
      where('status', '==', 'restrict')
    );
    this.countRequest = (await getCountFromServer(q)).data().count;
  }
  async getAssignmentCount() {
    let firestore = getFirestore();
    let q = query(
      collection(firestore, 'assignments'),
      where('code', '==', this.classId)
    );
    this.countAssignment = (await getCountFromServer(q)).data().count;
  }
  async getNoticesCount() {
    let firestore = getFirestore();
    let q = query(
      collection(firestore, 'notices'),
      where('code', '==', this.classId)
    );
    this.countNotice = (await getCountFromServer(q)).data().count;
  }
  async checkTeacher() {
    let firestore = getFirestore();
    let auth: any = getAuth();
    let user: any = auth.currentUser;

    // Checking for teacher
    let querySnapshot = await getDocs(
      query(
        collection(firestore, 'classes'),
        where('type', '==', 'teacher'),
        where('code', '==', this.classId),
        where('status', '==', 'allow')
      )
    );

    querySnapshot.forEach((doc) => {
      this.teacher.push(doc.data());
    });
    if (this.teacher[0].userid === user.uid) {
      this.isTeacher = true;
    }
  }
}
