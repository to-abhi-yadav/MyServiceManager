import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../users/user.service';
import { AuthorizationService } from '../shared/services/authorization.service';
import { User } from '../users/user';
import { EmptyObjectService } from '../shared/services/empty-object.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  isCollapsed = false
  currentUser: User
  userAdmin = false
  partnerAdmin = false
  tns = []
  logo: string
  showMobileNav = false
  showMobileNavigation = true
  showNavigation = false
  user: User
  features : string[] = [];
  showPortMyNumber: Boolean = false;
  showUserProfile: Boolean = true;
  subs = new Subscription();
  constructor(
    private authService: AuthorizationService,
    private userService: UserService,
    private objService: EmptyObjectService,
    private storage: LocalStorageService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    // Do we need to subscribe here? Are the values needed for the header going to change i.e. (phone numbers on the user) ZY - 2-22
    this.subs.add(this.userService.currentUser.subscribe(user => {
      this.currentUser = user
      if (this.currentUser) {
        if (this.currentUser.selectedTn === undefined) {
          this.currentUser.selectedTn = this.currentUser.telephoneNumbers[0]
        }
        this.tnChange()
      }
    }))
    this.logo = this.storage.getItem('logo')
  }

  ngOnInit() {
    if (this.currentUser) {
      if (this.currentUser.type === 'user_admin') {
        this.userAdmin = true
      } else if (this.currentUser.type === 'partner_admin') {
        this.partnerAdmin = true
      }
    }
    // Check for Port My Number
    this.user = this.storage.getItem('currentUser')
    this.features = this.user.selectedTn.features;
    for(let i in this.features) {
      if(this.features[i] == "Port My Number") {
        this.showPortMyNumber = true;
        this.showUserProfile = false;
      }
    }
    if(this.currentUser) {
      if(this.currentUser.userProfile != 1) {
        this.showUserProfile = false;
      }
    }
    if (window.location.pathname === '/login') {
      this.showMobileNavigation = false
      this.showNavigation = false
    } else if (this.route.snapshot.data.navigation === 'false') {
      this.showMobileNavigation = false
      this.showNavigation = false
    } else {
      this.showNavigation = true
      this.showMobileNavigation = true
    }
    this.cd.markForCheck()
  }

  ngAfterViewInit() {
  
  }

  ngOnDestroy(){
    this.subs.unsubscribe()
  }

  isEmptyObject(obj) {
    for(var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  tnChange() {
    this.tns.length = 0
    this.tns = []
    let empty;
    if (this.currentUser.telephoneNumbers[0]) {
      empty = this.isEmptyObject(this.currentUser.telephoneNumbers[0])
    } else {
      empty = true
    }
    if (!empty) {
      this.currentUser.telephoneNumbers.forEach( numbers => {
        if (this.currentUser.selectedTn.number !== numbers.tn.number) {
          this.tns.push(numbers.tn)
        }
      })
    } else {
      this.tns = []
    }
  }

  changeSelectedTn(tn) {
    this.userService.changeSelectedTN(tn)
    this.showMobileNav = false
  }

  logoutUser() {
    this.showMobileNavigation = false
    this.authService.logoutUser()
  }

  showMobileNavbar() {
    this.showMobileNav = !this.showMobileNav
  }

}
