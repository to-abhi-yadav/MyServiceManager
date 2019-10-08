import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User>
  public currentUser: Observable<User>
  private selectedTnSubject: BehaviorSubject<any>
  public selectedTn: Observable<any>

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')))
    this.selectedTnSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('selectedTn')))
    this.currentUser = this.currentUserSubject.asObservable()
    this.selectedTn = this.selectedTnSubject.asObservable()
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value
  }

  public get selectedTnValue(): any {
    return this.selectedTnSubject.value
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user)
    this.setSelectedTn(user.selectedTn)
  }
  
  setSelectedTn(tn: any) {
    this.selectedTnSubject.next(tn)
  }

  changeSelectedTN(tn: any){
    const user = this.currentUserSubject.value;
    user.selectedTn = tn;
    this.currentUserSubject.next(user);
    this.selectedTnSubject.next(tn);
  }

  updateComponentSequence(sequence){
    const user = this.currentUserSubject.value;
    user.componentSequence= sequence;
    this.currentUserSubject.next(user);
  }

  resetCurrentUser() {
    this.storage.setItem('currentUser', undefined)
    this.storage.setItem('bigRiverAccessToken', undefined)
    this.storage.setItem('bigRiverEmail', undefined)
    this.storage.setItem('selectedTn', undefined)
    this.storage.removeItem('currentUser')
    this.storage.removeItem('bigRiverAccessToken')
    this.storage.removeItem('bigRiverEmail')
    this.storage.removeItem('companyName')
    this.storage.removeItem('selectedTn')
    this.currentUserSubject.next(null)
    this.selectedTnSubject.next(null)
    this.router.navigate(['/'])
  }
}
