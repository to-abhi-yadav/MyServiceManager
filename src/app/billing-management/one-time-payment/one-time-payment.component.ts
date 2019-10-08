import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BillingManagementService } from '../billing-management.service'
import { User } from '../../users/user'
import { UserService } from '../../users/user.service'
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import * as dropin from 'braintree-web-drop-in';
import { faTintSlash } from '@fortawesome/free-solid-svg-icons';
import { tick } from '@angular/core/src/render3';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-one-time-payment',
  templateUrl: './one-time-payment.component.html',
  styleUrls: ['./one-time-payment.component.scss']
})

export class OneTimePaymentComponent implements OnInit {

  currentUser: User
  priorBalance = 0.0
  currentBalance = 0.0
  paymentDue = 0.0
  paymentAmount = 0.0
  clientToken = ""
  braintreeIsReady: boolean;
  dropIninstance: any;
  @ViewChild('paymentform') private paymentform: PaymentFormComponent;

  getCurrentBalance() {
    this.billingService.retrieveCurrentBalance(this.currentUser.selectedTn, this.currentUser.accountId)
      .subscribe(
        (res: 'text') => {
          const json = this.billingService.parseXml(res)
          this.priorBalance = Number(json['Response']['BillManagement']['PriorBalance'])
          this.currentBalance = Number(json['Response']['BillManagement']['CurrentBalance'])
          this.paymentDue = Number(json['Response']['BillManagement']['GrandTotal'])
          this.paymentAmount = this.paymentDue
          //console.log(json)
        }
      )
  }

  async getClientToken() {
    let res = await this.billingService.retrieveClientToken(this.currentUser.selectedTn, this.currentUser.accountId)
    const json = this.billingService.parseXml(res)
    this.clientToken = json['Response']['BillManagement']['Token']
  }

  async launchModal(){
    await this.getClientToken()
    this.paymentform.open()
  }

  constructor(
    private userService: UserService,
    private billingService: BillingManagementService
  ) { this.userService.currentUser.subscribe((user) => this.currentUser = user) }

  async ngOnInit() {
    this.getCurrentBalance()
    
  }

}
