import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FeaturesService } from '../shared/services/features.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { enableBindings } from '@angular/core/src/render3';
import { PhonePipe } from '../shared/pipes/phone.pipe';


@Component({
  selector: 'app-all-call-forwarding',
  templateUrl: './all-call-forwarding.component.html',
  styleUrls: ['./all-call-forwarding.component.scss'],
  providers: [ PhonePipe ]
})
export class AllCallForwardingComponent implements OnInit {
  currentUser: User
  selectedTN = ""
  enabledStatus: Boolean = false
  singleRingStatus: Boolean = false
  forwardingNumber: string
  component = 'AllCallForwardingComponent'
  invalidTn: Boolean = false
  errorMessage = ""
  saving: Boolean = false;
  hasError: Boolean = false;
  errorMsg: string = ''
  forwardingNumberCheck : Boolean = false;


  constructor(
    private featuresService: FeaturesService,
    private userService: UserService,
    private phonePipe: PhonePipe
  ) {
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user
    });
  }

  ngOnInit() {
    this.getAllCallForwarding();
    //console.log(this.currentUser)
  }

  checkStatus() {
    if (this.enabledStatus === false) {
      this.singleRingStatus = false
      this.forwardingNumberCheck = false;
    }
  }

  checkSingleRing() {
    this.enabledStatus = !this.enabledStatus;
    if (this.enabledStatus === false) {
      this.singleRingStatus = false;
      this.forwardingNumber = "";
      this.forwardingNumberCheck = false;
      this.featuresService.setAllCallForwarding(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        true,
        this.enabledStatus,
        this.forwardingNumber,
        this.singleRingStatus).subscribe((data) => {

        }, (error) => {

        })
    }
  }

  getAllCallForwarding() {
    //console.log(this.currentUser)
    //console.log(this.currentUser.selectedTn.number)
    this.featuresService.retrieveAllCallForwarding(this.currentUser.selectedTn.number, this.currentUser.accountId)
      .subscribe((res: 'text') => {
        let json = this.featuresService.parseXml(res);
        //console.log(json);
        this.enabledStatus = json['Response']['SwitchGetUnconditionalCallForwarding']['enabled'];
        this.singleRingStatus = json['Response']['SwitchGetUnconditionalCallForwarding']['single_ring'];
        if (json['Response']['SwitchGetUnconditionalCallForwarding']['enabled'] === "false") {
          this.enabledStatus = false;
        }
        if (json['Response']['SwitchGetUnconditionalCallForwarding']['enabled'] === "true") {
          this.forwardingNumberCheck = true;
        }
        if (json['Response']['SwitchGetUnconditionalCallForwarding']['single_ring'] === "false") {
          this.singleRingStatus = false;
        }
        this.forwardingNumber = this.phonePipe.transform(json['Response']['SwitchGetUnconditionalCallForwarding']['forwarding_number'], 'US')
      })
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

  setAllCallForwarding() {
    this.forwardingNumber = this.formatNumber(this.forwardingNumber)
    this.saving = true;
    if (this.enabledStatus === true) {
      this.invalidTn = false
      this.featuresService.setAllCallForwarding(this.currentUser.selectedTn.number, this.currentUser.accountId, true, this.enabledStatus,
        this.forwardingNumber, this.singleRingStatus).subscribe(
          (res: 'text') => {
            const json = this.featuresService.parseXml(res);
            this.forwardingNumber = this.phonePipe.transform(this.forwardingNumber)
            this.forwardingNumberCheck = true;
            this.saving = false;
          }
        )
    } else {
      this.invalidTn = false
      this.featuresService.setAllCallForwarding(this.currentUser.selectedTn.number, this.currentUser.accountId, true, this.enabledStatus,
        this.forwardingNumber, this.singleRingStatus).subscribe(
          (res: 'text') => {
            const json = this.featuresService.parseXml(res);
            this.forwardingNumber = this.phonePipe.transform(this.forwardingNumber)
            this.forwardingNumberCheck = true;
            this.saving = false;
          }
        )
    }
  }


}
