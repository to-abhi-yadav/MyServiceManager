import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/users/user.service';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthorizationService
) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.userService.currentUserValue;
    const token = this.authService.isTokenExpired()
    if (currentUser && token) {
      return true
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}})
      return false
    }
  }
}
