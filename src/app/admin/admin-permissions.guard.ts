import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user';

@Injectable({
  providedIn: 'root'
})
export class AdminPermissionsGuard implements CanActivate {
  currentUser: User
  value: boolean
  constructor(
    private userService: UserService,
    private router: Router,
    private storageService: LocalStorageService
  ) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const currentUser = this.userService.currentUserValue;
      if (currentUser.type === 'user_admin') {
        return true
      } else {
        return false
      }
  }
}
