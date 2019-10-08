import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { CallForwardingNoAnswerService } from './call-forwarding-no-answer.service';
import { enableBindings } from '@angular/core/src/render3';
import { NgModule } from '@angular/core';
import { PhonePipe } from '../shared/pipes/phone.pipe';

@Component({
  selector: 'app-call-forwarding-no-answer',
  templateUrl: './call-forwarding-no-answer.component.html',
  styleUrls: ['./call-forwarding-no-answer.component.scss'],
  providers: [CallForwardingNoAnswerService, PhonePipe]
})
export class CallForwardingNoAnswerComponent implements OnInit {
  component = 'CallForwardingNoAnswerComponent'
  currentUser : User;
  forwardingNumber : string = '';
  rings : string = '';
  isEnabled : Boolean = false;
  isToggling : boolean = false;
  saving : Boolean = false;
  hasError : Boolean = false;
  errorMsg : string = '';
  forwardingNumberCheck : Boolean = false;

  constructor(private cfnaService : CallForwardingNoAnswerService, private userService: UserService, private phonePipe: PhonePipe) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.cfnaService.retrieveCallForwardingNoAnswer(
        this.currentUser.token,
        this.currentUser.selectedTn.number,
        this.currentUser.accountId).subscribe((data) => {
          let jsonResponse = this.cfnaService.parseXml(data);
          if (jsonResponse["Response"]["Status"]["Code"] == "200") {
            let obj = jsonResponse["Response"]["SwitchGetDelayedCallForwarding"];
            this.rings = obj["rings"];
            this.isEnabled = this.stringToBoolOrNull(obj["enabled"]);
            if (this.isEnabled == false)
            {
              this.forwardingNumber = '';
            }
            else {
              this.forwardingNumberCheck = true;
              this.forwardingNumber = this.phonePipe.transform(obj["forwarding_number"], 'US')
            }
          } else {
            this.hasError = true;
            this.errorMsg = "Call Forwwarding No Answer information cannot be reached!"
          }
        })
    })
  }

  toggleEnabledStatus(){
    this.isEnabled = !this.isEnabled;
    this.forwardingNumber = this.formatNumber(this.forwardingNumber)
    // Disable Call Forwarding No Answer.
    if(this.isEnabled == false){
      this.isToggling = true;
      this.cfnaService.setCallForwardingNoAnswer(
        this.currentUser.token,
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        this.isEnabled,
        this.forwardingNumber,
        'variable',
        this.rings).subscribe((data) => {
          this.forwardingNumberCheck = false;
          this.forwardingNumber = "";
          this.isToggling = false;
        }, (error) => {
          this.isToggling = false;
          this.hasError = true;
          this.errorMsg = "Call Forwarding No Answer could not be turned off"
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


  setCallForwardingNoAnswer(){
    this.forwardingNumber = this.formatNumber(this.forwardingNumber)
    this.isToggling = true;
    this.saving = true;
    this.cfnaService.setCallForwardingNoAnswer(
    this.currentUser.token,
    this.currentUser.selectedTn.number,
    this.currentUser.accountId,
    true,
    this.forwardingNumber,
    'variable',
    this.rings).subscribe((data) => {
      this.forwardingNumberCheck = true;
      this.forwardingNumber = this.phonePipe.transform(this.forwardingNumber, 'US')
      this.isToggling = false;
      this.saving = false;
    }, (error) => {
      this.isToggling = false;
      this.saving = false;
      this.hasError = true;
      this.errorMsg = "Call Forwarding No Answer could not be turned on"
    })
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
