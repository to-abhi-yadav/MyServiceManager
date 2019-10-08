import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { SelectiveCallAcceptanceService} from './selective-call-acceptance.service'
import { BPClient } from 'blocking-proxy';
import { EmptyObjectService } from '../shared/services/empty-object.service';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-selective-call-acceptance',
  templateUrl: './selective-call-acceptance.component.html',
  styleUrls: ['./selective-call-acceptance.component.scss'],
  providers: [SelectiveCallAcceptanceService]
})
export class SelectiveCallAcceptanceComponent implements OnInit {

  component = 'SelectiveCallAcceptanceComponent'
  currentUser : User;
  isEnabled : Boolean = false;
  isToggling : Boolean = false;
  selectiveCallAcceptanceNumber : string = '';
  acceptedNumbers : String[] = [];
  saving : boolean = false;
  isDeleting : Boolean = false;
  // modal related
  modalRef: NgbModalRef
  hasError = false
  errorMsg = ''
  closeResult = ''
  hasPhoneNumbers : Boolean = false;

  constructor(private scaService: SelectiveCallAcceptanceService, private userService: UserService, private modalService: NgbModal, private objService: EmptyObjectService) { }

  
  ngOnInit() {
    this.acceptedNumbers = []
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.scaService.retrieveSelectiveCallAcceptance(this.currentUser.token,this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
        let jsonResponse = this.scaService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          let obj = jsonResponse["Response"]["SwitchGetDoNotDisturb"];
          this.isEnabled = this.stringToBoolOrNull(obj["enabled"]);
          if(this.isEnabled == true){
            this.getSelectiveCallAcceptanceNumbers();
            this.saving = false;
          }
        }
        else {
          this.hasError = true;
          this.errorMsg = 'Cannot check if Selective Call Acceptance is enabled or not!';
        }
      })
    })
  }

  toggleEnabledStatus(){
    this.isEnabled = !this.isEnabled;
    this.isToggling = true;
    // Turn Selective Call Acceptance On/Off.
    this.scaService.setSelectiveCallAcceptance(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      true,
      this.isEnabled,
      false,
      this.isEnabled).subscribe((data) => {
        this.isToggling = false;
        this.saving = false;
      }, (error) =>{
        this.hasError = true;
        this.errorMsg = "The request could not be processed!"
      })
      // Get the Seletive Call Acceptance Numbers if Selective Call Acceptance is turned on.
      if(this.isEnabled == true){
        this.getSelectiveCallAcceptanceNumbers();
      }
  }

  getSelectiveCallAcceptanceNumbers(){
    this.isToggling = true;
    this.scaService.retrieveSelectiveCallAcceptanceNumbers(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId).subscribe((data) => {
        let jsonResponse = this.scaService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          let obj = jsonResponse["Response"]["SwitchGetSelectiveCallAcceptanceNumbers"];
          const empty = this.objService.isEmptyObject(obj["acceptance_numbers"])
          if (!empty) {
            this.acceptedNumbers = obj["acceptance_numbers"].split(",");
            this.isToggling = false;
            this.hasPhoneNumbers = true;
          } else {
            this.acceptedNumbers = [];
            this.isToggling = false
          }
        }
      }
    )
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

  setSelectiveCallAcceptanceNumber(){
    this.selectiveCallAcceptanceNumber = this.formatNumber(this.selectiveCallAcceptanceNumber);
    this.hasPhoneNumbers = true;
    this.hasError = false
    this.isToggling = true;
    this.saving = true;
    this.scaService.AddSelectiveCallAcceptanceNumber(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      this.selectiveCallAcceptanceNumber).subscribe((data) => {
        // Insert into the table.
        this.acceptedNumbers.push(this.selectiveCallAcceptanceNumber);
        this.selectiveCallAcceptanceNumber = '';
        this.saving = false;
        this.isToggling = false;
        this.modalRef.close()
      }, (error) => {
        this.isToggling = false;
        this.hasError = true;
        this.errorMsg = "Cannot add the telephone number to Selective Call Acceptance!"
        this.saving = false
      }
    )
  }

  deleteAcceptedNumber(tn){
    this.isDeleting = true;
    this.scaService.DeleteSelectiveCallAcceptanceNumber(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      tn).subscribe((data) => {
        // Delete from table.
        const index = this.acceptedNumbers.indexOf(tn, 0)
        if(index > -1){
          this.acceptedNumbers.splice(index, 1);
        }
        this.isDeleting = false;
      }, (error) => {
        this.isDeleting = false;
        this.hasError = true;
        this.errorMsg = "Cannot delete the number!"
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

  public openLg(content) {
    this.hasError = false
    this.modalRef = this.modalService.open(content, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'})
    this.modalRef.result.then((result) => {
      console.log(result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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


}
