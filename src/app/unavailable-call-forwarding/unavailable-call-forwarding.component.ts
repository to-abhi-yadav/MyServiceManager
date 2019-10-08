import { Component, OnInit } from '@angular/core';
import { FeaturesService } from '../shared/services/features.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { PhonePipe } from '../shared/pipes/phone.pipe';
import { EmptyObjectService } from '../shared/services/empty-object.service';

@Component({
  selector: 'app-unavailable-call-forwarding',
  templateUrl: './unavailable-call-forwarding.component.html',
  styleUrls: ['./unavailable-call-forwarding.component.scss'],
  providers: [ PhonePipe ]
})
export class UnavailableCallForwardingComponent implements OnInit {
  component = 'UnavailableCallForwardingComponent'
  currentUser: User
  forwardingNumber = ""
  enabledStatus: Boolean = true
  invalidTn: Boolean = false
  errorMsg: string
  forwardingNumberCheck : Boolean = false;
  saving : Boolean = false;

  constructor(
    private featuresService: FeaturesService,
    private userService: UserService,
    private phonePipe: PhonePipe,
    private emptyObjService: EmptyObjectService
    ) { 
      this.userService.currentUser.subscribe((user) => this.currentUser = user);
    }

    ngOnInit() {
      //this.userService.currentUser.subscribe((user) => this.currentUser = user);
      console.log(this.currentUser);
      this.getUnavailableCallForwarding();
    }

  checkEnabled() {
    this.enabledStatus = !this.enabledStatus
    this.forwardingNumber = ""
    if(this.enabledStatus === false) {
      this.forwardingNumberCheck = false;
      this.featuresService.setUnavailableCallForwarding(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        true,
        this.enabledStatus,
        this.forwardingNumber).subscribe((data) => {

        }, (error) => {
          
        })
    }
  }

  formatNumber(number: any) {
    const regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi
    const num = number.replace(regex, "")
    if (num.length === 10) {
      console.log('Number is long enough')
    } else {
      console.log('Number IS NOT long enough')
    }
    return num
  }

  setUnavailableCallForwarding() {
    this.forwardingNumber = this.formatNumber(this.forwardingNumber)
    this.saving = true;
    if(this.enabledStatus === true){
      this.invalidTn = false
      this.featuresService.setUnavailableCallForwarding(this.currentUser.selectedTn.number, this.currentUser.accountId, true, this.enabledStatus, this.forwardingNumber).subscribe(
        (res: 'text') => {
          const json = this.featuresService.parseXml(res);
          this.forwardingNumberCheck = true;
          this.saving = false;
        }
      )
    } else {
      this.invalidTn = false
      this.featuresService.setUnavailableCallForwarding(this.currentUser.selectedTn.number, this.currentUser.accountId, true, this.enabledStatus, this.forwardingNumber).subscribe(
        (res: 'text') => {
          const json = this.featuresService.parseXml(res);
          this.forwardingNumberCheck = true;
          this.saving = false;
        })
    }
    this.forwardingNumber = this.phonePipe.transform(this.forwardingNumber, 'US')
  }

  getUnavailableCallForwarding() {
    this.featuresService.retrieveUnavailableCallForwarding(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe(
      (res: 'text') => {
        const json = this.featuresService.parseXml(res);
        const empty = this.emptyObjService.isEmptyObject(json['Response']['SwitchGetUnavailableCallForwarding']['forwarding_number'])
        if (!empty) {
          this.forwardingNumberCheck = true;
          this.forwardingNumber = this.phonePipe.transform(json['Response']['SwitchGetUnavailableCallForwarding']['forwarding_number'], 'US')
        }
        this.enabledStatus = json['Response']['SwitchGetUnavailableCallForwarding']['enabled'] 
        if(json['Response']['SwitchGetUnavailableCallForwarding']['enabled']  === "false") {
          this.enabledStatus = false
        }


      }
    )
  }

}
