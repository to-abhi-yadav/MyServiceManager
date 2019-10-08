import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { CallForwardingBusyService } from './call-forwarding-busy.service';
import { enableBindings } from '@angular/core/src/render3';
import { PhonePipe } from '../shared/pipes/phone.pipe';


@Component({
  selector: 'app-call-forwarding-busy',
  templateUrl: './call-forwarding-busy.component.html',
  styleUrls: ['./call-forwarding-busy.component.scss'],
  providers: [CallForwardingBusyService, PhonePipe]
})
export class CallForwardingBusyComponent implements OnInit {
  component = 'CallForwardingBusyComponent'
  currentUser : User;
  isSubscribed = false;
  isEnabled: Boolean = false;
  isToggling: Boolean = false;
  saving: Boolean = false;
  variant:string = ''
  forwardingNumber: string = '';
  hasError: Boolean = false;
  errorMsg: string = ''
  forwardingNumberCheck : Boolean = false;

  constructor(private cfbService: CallForwardingBusyService, private userService: UserService, private phonePipe: PhonePipe) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.cfbService.retreiveCallForwardingBusy(this.currentUser.token, this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
        let jsonResponse = this.cfbService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          let obj = jsonResponse["Response"]["SwitchGetBusyCallForwarding"];
          this.isEnabled = this.stringToBoolOrNull(obj["enabled"]);
          if (this.isEnabled == false)
          {
            this.forwardingNumber = '';
          }
          else {
            this.forwardingNumberCheck = true;
            this.forwardingNumber = obj["forwarding_number"];
            this.forwardingNumber = this.phonePipe.transform(this.forwardingNumber, 'US')
          }
          this.variant = obj["variant"];
        } else {
          this.hasError = true;
          this.errorMsg = "Call Forwwarding Busy information cannot be reached!"
        }
      })
    })
  }

  toggleEnabledStatus(){
    this.isEnabled = !this.isEnabled;
    this.forwardingNumber = this.formatNumber(this.forwardingNumber)
    // Disable call forwarding busy.
    if (this.isEnabled == false){
      this.isToggling = true;
      this.cfbService.setCallForwardingBusy(
        this.currentUser.token,
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        true,
        false,
        this.forwardingNumber,
        'variable').subscribe((data) =>{
          this.isToggling = false;
          this.forwardingNumber = "";
          this.forwardingNumberCheck = false;
        }, (error) =>{
          this.isToggling = false;
          this.hasError = true;
          this.errorMsg = "Call Forwarding Busy could not be turned off"
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

  setCallForwardingBusy(){
    this.forwardingNumber = this.formatNumber(this.forwardingNumber)
    this.isToggling = true;
    this.saving = true;
    this.cfbService.setCallForwardingBusy(
      this.currentUser.token,  
      this.currentUser.selectedTn.number, 
      this.currentUser.accountId,
      true,
      true,
      this.forwardingNumber,
      'variable').subscribe((data) => {
        this.isToggling = false;
        // If the data is good, set new value
        this.forwardingNumberCheck = true;
        this.forwardingNumber = this.phonePipe.transform(this.forwardingNumber, 'US')
        this.saving = false;
      }, (error) => {
        this.isToggling = false;
        this.saving = false;
        this.hasError = true;
        this.errorMsg = "Call Forwarding Busy could not be turned on"
      }
    )
  }

  stringToBoolOrNull(str: string) {
    if (str == "True" || str == "TRUE" || str == "true") {
      return true;
    } else if (str == "False" || str == "FALSE" || str == "false"){
      return false;
    } else {
      return null;
    }
  }
}
