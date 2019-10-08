import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { BillingManagementService } from '../billing-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';
import { User } from 'src/app/users/user';
import * as dropin from 'braintree-web-drop-in';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  closeResult: string;
  braintreeIsReady: boolean;
  paymentError = false;
  paymentSuccess = false;
  paymentShowSubmit = false;
  isLoadingPayment = false;
  paymentReceipt: string;
  paymentPrice: number;
  paymentErrorMessage: string;
  paymentErrorCode: any
  dropIninstance: any;
  paymentNonce = "";
  @ViewChild('content') public content: ElementRef;
  @Input() currentUser: User;
  @Input() clientToken = "";
  @Input() price = 0;
  
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
    this.isLoadingPayment = true;
    //console.log(this.clientToken)
    this.paymentError = false
    this.paymentSuccess = false
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
      this.paymentShowSubmit = true;
      this.isLoadingPayment = false;
      //console.log(this.dropIninstance)
    });
  }

  pay() {
    this.dropIninstance.requestPaymentMethod((err, payload) => {
      if (err) {
        // deal with error
        console.log(err)
      }
      else {
        //send nonce to the server
        this.paymentNonce = payload.nonce
        this.dropIninstance.teardown()
        this.isLoadingPayment = true
        this.billingService.makePayment(this.currentUser.selectedTn.number, this.currentUser.accountId, this.price, this.paymentNonce)
          .subscribe((res: 'text') => {
            const json = this.billingService.parseXml(res)
            console.log(json)
            if(json['Response']['Status']['Code'] === "200"){
              //this.dropIninstance.teardown()
              this.isLoadingPayment = false
              this.paymentError = false
              this.paymentSuccess = true
              this.paymentShowSubmit = false
              this.paymentReceipt = json['Response']['BillManagement']['RecieptNumber']
              this.paymentPrice = json['Response']['BillManagement']['Price']
              console.log(this.paymentReceipt)
              console.log(this.paymentPrice)
              /*<Response>
                <BillManagement>
                <Message>Payment Accepted</Message>
                <Price>10.00</Price>
                <RecieptNumber>4rb9k6kk</RecieptNumber>
                </BillManagement>
                <Status>
                <Code>200</Code>
                <Message>Success</Message>
                </Status>
                </Response>*/
            }
          }, error => {
            this.isLoadingPayment = false
            //this.dropIninstance.teardown()
            const json = this.billingService.parseXml(error.error)
            this.paymentErrorMessage = json['Response']['Status']['Message']
            this.paymentErrorCode = json['Response']['Status']['Code']
            console.log(this.paymentErrorMessage)
            console.log(this.paymentErrorCode)
            this.braintreeIsReady = false
            this.paymentShowSubmit = false
            this.paymentError = true
            this.paymentSuccess = false
            //To Do - Add various payment errors and codes
          })
      }
    });
  }

  submitForm() {
    this.pay()
  }

  async retryPayment() {
    await this.createPaymentForm()
  }

  public async open() {
    this.paymentError = false
    let content = this.content
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.createPaymentForm()
  }

  private getDismissReason(reason: any): string {
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

  async ngOnInit() {
    
  }
}
