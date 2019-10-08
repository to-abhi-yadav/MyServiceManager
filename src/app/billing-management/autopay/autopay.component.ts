import { EventEmitter, Output, Component, OnInit, AfterViewInit, ViewChild, InjectionToken, FactoryProvider, Inject, Injectable } from '@angular/core';
import { BillingManagementService } from '../billing-management.service'
import { User } from '../../users/user'
import { UserService } from '../../users/user.service'
import { AutopayFormComponent } from '../autopay-form/autopay-form.component';

@Component({
  selector: 'app-autopay',
  templateUrl: './autopay.component.html',
  styleUrls: ['./autopay.component.scss']
})

export class AutopayComponent implements OnInit {
  
  @ViewChild('autopayform') private autopayform: AutopayFormComponent;
  @Output() autopayModal= new EventEmitter<any>();
  currentUser: User
  clientToken: any
  autopayEnable = false
  lastFour: any;
  expirationDate: any;
  email = "";
  isLoadingAutopay = false;
  isRegistrationAutopay: boolean;

  finishedForm() {
    this.autopayModal.emit()
  }
  async getClientToken() {
    let res = await this.billingService.retrieveClientToken(this.currentUser.selectedTn.number, this.currentUser.accountId)
    const json = this.billingService.parseXml(res)
    this.clientToken = json['Response']['BillManagement']['Token']
  }

  async getAutopayInfo() {
    this.isLoadingAutopay = true
    let res = this.billingService.retrieveAutopayInfo(this.currentUser.selectedTn.number, this.currentUser.accountId)
      .subscribe((res: 'text') => {
        
        const json = this.billingService.parseXml(res)
        console.log(json)
        if(json['Response']['BillManagement']['AutoPay'] === "Subscribed") {
          if(json['Response']['BillManagement']['Email'] != "None") {
            this.email = json['Response']['BillManagement']['Email']
          }
          this.lastFour = json['Response']['BillManagement']['Last4']
          this.expirationDate = json['Response']['BillManagement']['ExpirationDate']
          
          this.autopayEnable = true
        }
        else {
          this.email = json['Response']['BillManagement']['Email']
          this.autopayEnable = false
          console.log("email: " + this.email)
        }
        console.log(json)
        this.isLoadingAutopay = false
      }, error => {
        console.log(error.error)
        this.isLoadingAutopay = false
      })
  }

  
  async launchModalRegister(){
    this.isRegistrationAutopay = true
    await this.getClientToken()
    this.autopayform.open()
  }

  async launchModalUpdate(){
    this.isRegistrationAutopay = false
    await this.getClientToken()
    this.autopayform.open()
  }

  constructor(
    private userService: UserService,
    private billingService: BillingManagementService
  ) { this.userService.currentUser.subscribe((user) => this.currentUser = user) }

  async ngOnInit() {
    this.isLoadingAutopay = true
    await this.getAutopayInfo()
    this.isLoadingAutopay = false
  }
}
