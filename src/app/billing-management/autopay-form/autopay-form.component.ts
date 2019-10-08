import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { BillingManagementService } from '../billing-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../users/user.service';
import { User } from '../../users/user';
import * as dropin from 'braintree-web-drop-in';
import { EventEmitter } from 'selenium-webdriver';

@Component({
  selector: 'app-autopay-form',
  templateUrl: './autopay-form.component.html',
  styleUrls: ['./autopay-form.component.scss']
})

export class AutopayFormComponent implements OnInit {
  closeResult: string;
  braintreeIsReady: boolean;
  autopayError = false;
  autopaySuccess = false;
  autopayShowSubmit = false;
  isLoadingAutopay = false;
  autopayErrorMessage: string;
  autopayErrorCode: any;
  dropIninstance: any;
  paymentNonce = "";
  autopayType = "";
  clientToken: string;
  autopaySuccessMessage = "";
  @ViewChild('content') public content: ElementRef;
  @Input() currentUser: User;
  @Input() email: string;
  @Input() isRegistrationAutopay: boolean;
  //onClose = new EventEmitter();

  async getClientToken() {
    let res = await this.billingService.retrieveClientToken(this.currentUser.selectedTn.number, this.currentUser.accountId)
    const json = this.billingService.parseXml(res)
    this.clientToken = json['Response']['BillManagement']['Token']
    /*this.billingService.retrieveClientToken(this.currentUser.selectedTn, this.currentUser.accountId)
      .subscribe((res: 'text') => {
        const json = this.billingService.parseXml(res)
        this.clientToken = json['Response']['BillManagement']['Token']
        console.log(this.clientToken)
      })*/
  }

  async createPaymentForm() {
    this.isLoadingAutopay = true;
    //console.log(this.clientToken)
    this.autopayError = false
    this.autopaySuccess = false
    await this.getClientToken()
    dropin.create({
      authorization: this.clientToken,
      selector: '#dropin-container'
    },(err, dropinInstance) => {
      if (err) {
        // Handle any errors that might've occurred when creating Drop-in
        console.error(err);
        return;
      }
      this.dropIninstance = dropinInstance;
      this.braintreeIsReady = true;
      this.autopayShowSubmit = true;
      this.isLoadingAutopay = false;
      //console.log(this.dropIninstance)
    });
  }

  register() {
    console.log("email: " + this.email)
    this.dropIninstance.requestPaymentMethod((err, payload) => {
      if (err) {
        // deal with error
        console.log(err)
      }
      else {
        //send nonce to the server
        this.paymentNonce = payload.nonce
        this.dropIninstance.teardown()
        this.isLoadingAutopay = true
        this.billingService.setAutopay(this.currentUser.selectedTn.number, this.currentUser.accountId, this.email , this.paymentNonce)
          .subscribe((res: 'text') => {
            const json = this.billingService.parseXml(res)
            console.log(json)
            if(json['Response']['Status']['Code'] === "200"){
              //this.dropIninstance.teardown()
              this.isLoadingAutopay = false
              this.autopayError = false
              this.autopaySuccess = true
              this.autopayShowSubmit = false
              this.autopaySuccessMessage = "Autopay Registration Successful"
            }
          }, error => {
            this.isLoadingAutopay = false
            //this.dropIninstance.teardown()
            const json = this.billingService.parseXml(error.error)
            this.autopayErrorMessage = json['Response']['Status']['Message']
            this.autopayErrorCode = json['Response']['Status']['Code']
            console.log(this.autopayErrorMessage)
            console.log(this.autopayErrorCode)
            this.braintreeIsReady = false
            this.autopayShowSubmit = false
            this.autopayError = true
            this.autopaySuccess = false
            //To Do - Add various payment errors and codes
          })
      }
    });
  }

  update() {
    this.dropIninstance.requestPaymentMethod((err, payload) => {
      if (err) {
        // deal with error
        console.log(err)
      }
      else {
        //send nonce to the server
        this.paymentNonce = payload.nonce
        this.dropIninstance.teardown()
        this.isLoadingAutopay = true
        this.billingService.updateAutopay(this.currentUser.selectedTn.number, this.currentUser.accountId, this.email , this.paymentNonce)
          .subscribe((res: 'text') => {
            const json = this.billingService.parseXml(res)
            console.log(json)
            if(json['Response']['Status']['Code'] === "200"){
              //this.dropIninstance.teardown()
              this.isLoadingAutopay = false
              this.autopayError = false
              this.autopaySuccess = true
              this.autopayShowSubmit = false
              this.autopaySuccessMessage = "Autopay Update Successful"
            }
          }, error => {
            this.isLoadingAutopay = false
            //this.dropIninstance.teardown()
            const json = this.billingService.parseXml(error.error)
            this.autopayErrorMessage = json['Response']['Status']['Message']
            this.autopayErrorCode = json['Response']['Status']['Code']
            console.log(error.error)
            console.log(this.autopayErrorMessage)
            console.log(this.autopayErrorCode)
            this.braintreeIsReady = false
            this.autopayShowSubmit = false
            this.autopayError = true
            this.autopaySuccess = false
            //To Do - Add various payment errors and codes
          })
      }
    });
  }

  submitForm() {
    if(this.isRegistrationAutopay === true) {
      this.register()
    }
    else {
      this.update()
    }
    
  }

  async retryRegistration() {
    await this.createPaymentForm()
  }

  async retryUpdate() {
    await this.createPaymentForm()
  }

  public async open() {
    this.autopayError = false
    let content = this.content
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log(this.isRegistrationAutopay)
    if(this.isRegistrationAutopay === true) {
      this.autopayType = "Autopay Registration"
    }
    else {
      this.autopayType = "Autopay Update"
    }
    await this.createPaymentForm()
  }

  private getDismissReason(reason: any): string {
    //this.onClose.emit('Closing');
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  constructor(private fb: FormBuilder,
    private modalService: NgbModal, 
    private userService: UserService, 
    private billingService: BillingManagementService) { }

  ngOnInit() {
    
  }

}
