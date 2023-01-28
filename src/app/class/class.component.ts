import { Component, EventEmitter, Input,Output } from '@angular/core';
import {
  doc,
  getFirestore,
  deleteDoc,
} from "firebase/firestore";
@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent{
  @Input('class') class: any;
  @Output('onDelete') onDelete = new EventEmitter();

  delete(id: string){
    // Remove the request
    let firestore = getFirestore();
    deleteDoc(doc(firestore,"classes",id)).then(()=>{
      this.onDelete.emit();
    })
  }
  
}
