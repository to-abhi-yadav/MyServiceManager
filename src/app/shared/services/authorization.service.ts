import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { UserService } from 'src/app/users/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private storage: LocalStorageService,
    private userService: UserService
  ) { }

  handleAuthEvent(user: any) {
    this.storage.setItem('currentUser', user)
    this.storage.setItem('bigRiverAccessToken', user.token)
    this.storage.setItem('bigRiverEmail', user.email)
    this.storage.setItem('selectedTn', user.selectedTn)
  }

  isTokenExpired() {
    const user = this.storage.getItem('currentUser')
    if (user) {
      const tokenExpiry = user.expiryDate
      if (tokenExpiry.valueOf() < new Date().valueOf()) {
        console.log('Token is expired! Logging out user...')
        this.logoutUser()
      }
      return !(tokenExpiry.valueOf() > new Date().valueOf());
    } else {
      return false
    }

  }

  logoutUser(): void {
    this.userService.resetCurrentUser()
  }

  removeAuthorization() {
    this.storage.setItem('currentUser', undefined)
    this.storage.setItem('bigRiverAccessToken', undefined)
    this.storage.setItem('bigRiverEmail', undefined)
    this.storage.removeItem('currentUser')
    this.storage.removeItem('bigRiverAccessToken')
    this.storage.removeItem('bigRiverEmail')
    this.storage.removeItem('companyName')
  }

}
