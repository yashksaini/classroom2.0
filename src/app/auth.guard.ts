import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
        let auth: any = getAuth();
        onAuthStateChanged(auth,(user)=>{
            if(user){
                resolve(true);
            }else {
                this.router.navigate(['/home']);
                resolve(false);
            }
        });
    });
  }
}
