import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FeaturesService } from '../shared/services/features.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user';

@Component({
  selector: 'app-do-not-disturb',
  templateUrl: './do-not-disturb.component.html',
  styleUrls: ['./do-not-disturb.component.scss']
})
export class DoNotDisturbComponent implements OnInit {
  component = 'DoNotDisturbComponent'
  @ViewChild('enabled') en: ElementRef
  @ViewChild('singleRing') sr: ElementRef
  currentUser: User
  singleRingStatus: Boolean = false
  enabledStatus: Boolean = false
  testing: Boolean = false
  testing2: Boolean = false
  getDoNotDisturb() {
    this.featured.retrieveDoNotDisturb(this.currentUser.selectedTn.number.toString(), this.currentUser.accountId.toString()).subscribe(
      (res: 'text') => {
        let json = this.featured.parseXml(res)
        this.enabledStatus = json['Response']['SwitchGetDoNotDisturb']['enabled']
        this.singleRingStatus = json['Response']['SwitchGetDoNotDisturb']['single_ring']
        //this.enabledStatus = true
        if(json['Response']['SwitchGetDoNotDisturb']['enabled'] === "false") {
          this.enabledStatus = false;
        }

        if(json['Response']['SwitchGetDoNotDisturb']['single_ring'] === "false") {
          this.singleRingStatus = false;
        }

        //this.singleRingStatus = json['Response']['SwitchGetDoNotDisturb']['single_ring']
        //this.singleRingStatus = true
        //console.log(res)
        //console.log(this.enabledStatus + ',    ' + this.singleRingStatus)
      }
    );
  }

  setDoNotDisturb() {
    this.featured.setDoNotDisturb(this.currentUser.selectedTn.number.toString(), this.currentUser.accountId.toString(), 
      true, this.enabledStatus, this.singleRingStatus, false).subscribe(
      (res: 'text') => {
        let json = this.featured.parseXml(res)
        //console.log(res)
      }
    )
  }

  checkEnabledStatus() {
    this.enabledStatus = !this.enabledStatus
    //console.log('check enabled function first: ' + this.enabledStatus)
    /*if(this.enabledStatus === false) {
      this.enabledStatus = true
    } 
    else {
      this.enabledStatus = false
    }*/
    //console.log('check enabled function second: ' + this.enabledStatus)
    if(this.enabledStatus === false){
      this.singleRingStatus = false
    }
    //console.log('EnabledStatus: ' + this.enabledStatus)
    //console.log('SingleRingStatus: ' + this.singleRingStatus)
    this.setDoNotDisturb()
    //this.getDoNotDisturb()
  }

  checkSingleRingStatus() {
    this.singleRingStatus = !this.singleRingStatus
    
    //console.log('SingleRingStatus: ' + this.singleRingStatus)
    this.setDoNotDisturb()

  }

  constructor(
    private featured: FeaturesService,
    private user: UserService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.user.currentUser.subscribe(user => this.currentUser = user)
    this.getDoNotDisturb()
    

    //console.log(this.currentUser)
    //console.log(this.currentUser.selectedTn.number);
   // this.getDoNotDisturb()
  }

  ngAfterViewInit() {
    //this.getDoNotDisturb()
  }

  

}
