import { Component, OnInit } from '@angular/core';
import { HuntingService } from './hunting.service';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hunting',
  templateUrl: './hunting.component.html',
  styleUrls: ['./hunting.component.scss'],
  providers: [HuntingService]
})
export class HuntingComponent implements OnInit {

  component = 'HuntingComponent'
  currentUser : User;
  isInitializing: boolean = true;
  isEnabled : Boolean = false;
  isToggling : Boolean = false;
  huntingPhoneNumber : string = '';
  huntingPhoneNumberLength: number = 0;
  phoneNumbers : string[] = []
  eligibleNumbers: string[] = []
  hasPhoneNumbers:boolean = false;
  lastDeletedTn: string = ''
  saving : boolean = false;
  isLoadingRules: boolean = false;
  isDeleting : Boolean = false;
  // modal related
  modalRef: NgbModalRef
  hasError = false
  errorMsg = ''
  closeResult = ''
  indexToInsert:number = 0;

  constructor(private huntingService: HuntingService, private userService: UserService, private modalService: NgbModal) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue
    this.getHuntingSettings();
  }

  getHuntingSettings(){
    this.huntingService.retrieveHuntingSettings(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe(data => {
      const parsed = this.huntingService.parseXml(data);
      // If all good
      if (this.huntingService.isResponseDataOk(parsed)) {
        this.isEnabled = this.stringToBoolOrNull(parsed["Response"]["SwitchGetHunting"]["enabled"])
        if (this.isEnabled) {
          this.getHuntingRules()
          this.getHuntingEligibleNumbers();
        }
      }
    })
  }

  getHuntingRules(){
    this.huntingService.retrieveHuntingRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
      const parsed = this.huntingService.parseXml(data);
      if (this.huntingService.isResponseDataOk(parsed)) {
        this.phoneNumbers = [];
        if (parsed["Response"]["SwitchGetHuntingNumbers"]["HuntingNumber"] && parsed["Response"]["SwitchGetHuntingNumbers"]["HuntingNumber"].length > 1){
          // Array
          parsed["Response"]["SwitchGetHuntingNumbers"]["HuntingNumber"].map(tn => {
            this.phoneNumbers.push(tn["number"]);
          })
          this.hasPhoneNumbers = true;
        } else if (parsed["Response"]["SwitchGetHuntingNumbers"] && typeof parsed["Response"]["SwitchGetHuntingNumbers"] === "object") {
          if (parsed["Response"]["SwitchGetHuntingNumbers"]["HuntingNumber"] && typeof parsed["Response"]["SwitchGetHuntingNumbers"]["HuntingNumber"] === "object") {
            // Single object
            this.phoneNumbers.push(parsed["Response"]["SwitchGetHuntingNumbers"]["HuntingNumber"]["number"])
            this.hasPhoneNumbers = true;
          } else {
            // empty
            this.hasPhoneNumbers = false;
          }
        }
        this.isToggling = false;
        this.saving = false;
      } else {
        // Error getting rules
      }
    })
  }

  getHuntingEligibleNumbers(){
    this.huntingService.retrieveEligibleHuntingNumbers(this.currentUser.selectedTn.number, this.currentUser.accountId, this.currentUser.subId).subscribe(data => {
      const parsed = this.huntingService.parseXml(data);
      parsed["Response"]["HuntingNumbers"]["tn"].map(tn => {
        // if (tn !== this.currentUser.selectedTn.number){
          this.eligibleNumbers.push(tn);
        // }
      })
    })
  }

  toggleEnabledStatus(){
    console.log("Hit toggle enabled status")
    this.isToggling = true;
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      // First delete all numbers, then disable
      this.huntingService.DeleteAllHuntingRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
        this.huntingService.setHuntingSettings(this.currentUser.selectedTn.number, this.currentUser.accountId, this.isEnabled)
          .subscribe((data) => {
            this.isToggling = false;
            this.isLoadingRules = true;
            this.getHuntingRules();
          }, (error) =>{
            this.hasError = true;
            this.errorMsg = "The request could not be processed!"
          })
      })
    } else {
      this.isToggling = true;
      // Turn Selective Call Acceptance On/Off.
      this.huntingService.setHuntingSettings(this.currentUser.selectedTn.number, this.currentUser.accountId, this.isEnabled).subscribe((data) => {
        this.isToggling = false;
        this.isLoadingRules = true;
        this.getHuntingRules();
      }, (error) =>{
        this.hasError = true;
        this.errorMsg = "The request could not be processed!"
      })
    }
  }

  

  deleteNumber(tn){
    this.isToggling = true;
    console.log("Hit delete Number", tn)
    this.lastDeletedTn = tn;
    this.huntingService.DeleteAllHuntingRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) =>{
      // If successful, remove the deleted TN from the array
      const index = this.phoneNumbers.indexOf(this.lastDeletedTn, 0);
      if (index > -1) {
        this.phoneNumbers.splice(index, 1);
      }

      // Once removed from the array, loop over all remaining TN's, adding them back to the list of rules
      if (this.phoneNumbers.length > 0){
        this.addAllCurrentNumbers()
      } else {
        this.isToggling = false;
        this.hasPhoneNumbers = false;
      }
    })
  }

  addNumber(tn) {
    console.log("Hit add number");
    this.insertTnAtIndex(tn)
    // this.phoneNumbers.push(tn);
    this.addAllCurrentNumbers()
  }

  addAllCurrentNumbers(){
    this.huntingService.AddHuntingRules(this.currentUser.selectedTn.number, this.currentUser.accountId, this.formatNumbersForPost()).subscribe((data) => {
      if (this.huntingService.isResponseDataOk(this.huntingService.parseXml(data))){
        // Everything worked
        this.getHuntingRules();
        this.closeModal();
      } else {
        console.log("ERROR: Hunting - addNumber");
      }
      this.huntingPhoneNumber = ''
      this.indexToInsert = 0;
    }, (error) => {
      console.log(error);
    })
  }

  updateHuntingPhoneNumber($event){
    this.huntingPhoneNumber = $event.currentTarget.value
    let strippedTn = this.strippedHuntingPhoneNumber();
    this.huntingPhoneNumberLength = strippedTn.length;
  }

  saveHuntingNumber(){
    console.log("Hit save hunting number")
    if (this.strippedHuntingPhoneNumber().length === 10){
      this.isToggling = true;
      this.saving = true;
      this.addNumber(this.strippedHuntingPhoneNumber())
    }
  }

  strippedHuntingPhoneNumber(){
    return this.huntingPhoneNumber.replace(/[^0-9.]/g, "");
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

  public openLg(content, isInsert:boolean=false, index:number = this.phoneNumbers.length) {
    console.log(isInsert);
    console.log(index);
    this.indexToInsert = index;
    this.hasError = false
    this.modalRef = this.modalService.open(content, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'})
    this.modalRef.result.then((result) => {
      console.log(result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeModal(){
    if (this.modalService.hasOpenModals()){
      this.modalRef.close();
      this.huntingPhoneNumber = '';
      this.indexToInsert = 0;
    }
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
  
  insertTnAtIndex(tn){
    this.phoneNumbers.splice(this.indexToInsert, 0, tn);
  }

  formatNumbersForPost(){
    let tnArray = []
    this.phoneNumbers.map((num, index) => {
      let obj = {"tn": num, "order": (index+1).toString()}
      tnArray.push(obj)
    });
    console.log(JSON.stringify(tnArray))
    return JSON.stringify(tnArray)
  }

}
