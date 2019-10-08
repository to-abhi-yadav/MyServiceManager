import { Component, OnInit } from '@angular/core';
import { User } from '../users/user';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FindMeFollowMeService } from './find-me-follow-me.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-find-me-follow-me',
  templateUrl: './find-me-follow-me.component.html',
  styleUrls: ['./find-me-follow-me.component.scss'],
  providers: [FindMeFollowMeService]
})
export class FindMeFollowMeComponent implements OnInit {
  component = 'FindMeFollowMeComponent'
  currentUser : User;
  isInitializing: boolean = true;
  isEnabled : Boolean = false;
  isToggling : Boolean = false;
  fmFmNumber : string = '';
  fmFmNumberLength: number = 0;
  phoneNumbers : string[] = [];
  hasPhoneNumbers:boolean = true;
  lastDeletedTn: string = ''
  saving : boolean = false;
  isLoadingRules: boolean = false;
  isDeleting : Boolean = false;
  // modal related
  modalRef: NgbModalRef
  isModalOpen: boolean = false;
  hasError = false
  errorMsg = ''
  closeResult = ''

  constructor(private fmfmService: FindMeFollowMeService, private userService: UserService, private modalService: NgbModal) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue
    this.getFmFmSettings();
  }

  getFmFmSettings(){
    this.fmfmService.retrieveFmFmSettings(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
      const parsed = this.fmfmService.parseXml(data);
      if (parsed["Response"]["Status"]["Code"] === "200") {
        const myData = parsed["Response"]["SwitchGetFindMeFollowMe"]
        this.isEnabled = this.stringToBoolOrNull(myData.enabled)
      }
      if (this.isEnabled){
        this.getFmFmRules();
      } else {
        this.isInitializing = false;
      }
    })
  }

  getFmFmRules(){
    this.fmfmService.retrieveFmFmRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((ruleData) => {
      const myRuleData = this.fmfmService.parseXml(ruleData);
      if (myRuleData["Response"]["Status"]["Code"] === "200"){
        const ruleSet = myRuleData["Response"]["SwitchGetFindMeFollowMeRules"]
        if (ruleSet["FindMeFollowMeRule"] && ruleSet["FindMeFollowMeRule"].length > 1){
          ruleSet["FindMeFollowMeRule"].map((rule) => {
            let num = rule["number_to_ring"];
            if (num.length > 10){
              num = num.substring(1);
            }
            this.phoneNumbers.push(num)
          })
          this.hasPhoneNumbers = true;
        } else if (typeof ruleSet["FindMeFollowMeRule"] === "object"){
          if (ruleSet["FindMeFollowMeRule"] && ruleSet["FindMeFollowMeRule"]["number_to_ring"]){
            let num = ruleSet["FindMeFollowMeRule"]["number_to_ring"];
            if (num.length > 10){
              num = num.substring(1);
            }
            this.phoneNumbers.push(num)
            this.hasPhoneNumbers = true;
          } else {
            this.hasPhoneNumbers = false;
          }
        } else {
          // User has no numbers configured for this
          this.hasPhoneNumbers = false;
        }
      }
      this.isInitializing = false;
      this.isLoadingRules = false;
    })
  }

  toggleEnabledStatus(){
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      // First delete all numbers, then disable
      this.fmfmService.DeleteAllFmFmRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
        this.fmfmService.setFmFmSettings(this.currentUser.selectedTn.number, this.currentUser.accountId, this.isEnabled)
          .subscribe((data) => {
            this.isToggling = false;
            this.isLoadingRules = true;
            this.getFmFmRules();
          }, (error) =>{
            this.hasError = true;
            this.errorMsg = "The request could not be processed!"
          })
      })
    } else {
      this.isToggling = true;
      // Turn Selective Call Acceptance On/Off.
      this.fmfmService.setFmFmSettings(this.currentUser.selectedTn.number, this.currentUser.accountId, this.isEnabled).subscribe((data) => {
        this.isToggling = false;
        this.isLoadingRules = true;
        // Get the FmFmRules & display
        this.fmfmService.retrieveFmFmRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
          // Check data, if returns anything display it, otherwise display "You have no Find-Me Follow-Me rules set up"
          this.isLoadingRules = false;
        })
      }, (error) =>{
        this.hasError = true;
        this.errorMsg = "The request could not be processed!"
      })
    }
  }

  deleteNumber(tn){
    this.lastDeletedTn = tn;
    this.isToggling = true;
    this.fmfmService.DeleteAllFmFmRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) =>{
      // If successful, remove the deleted TN from the array
      const index = this.phoneNumbers.indexOf(this.lastDeletedTn, 0);
      if (index > -1) {
        this.phoneNumbers.splice(index, 1);
      }

      if (this.phoneNumbers.length >= 1){
          this.setNumbers(null)
      } else {
        this.hasPhoneNumbers = false;
      }
      this.isToggling = false;
    })
  }

  setNumbers(tn) {
    if (tn != null) {
      this.phoneNumbers.push(tn)
    }
    // Setup the data structure for the array of objects BR needs
    let formattedTelephoneNumbers = this.formatTnsForBigRiverUpdate();
    this.fmfmService.AddFmFmRules(this.currentUser.selectedTn.number, this.currentUser.accountId, formattedTelephoneNumbers).subscribe((data) => {
      if (this.phoneNumbers.length > 0){
        this.hasPhoneNumbers = true;
      }
      this.closeModal();
      this.fmFmNumber = ''
      this.saving = false;
    }, (error) => {
      // if error
    })
  }

  formatTnsForBigRiverUpdate(){
    let tnArray = []
    this.phoneNumbers.map((num, index) => {
      let obj = {"tn": num, "order": (index+1).toString()}
      tnArray.push(obj)
    });
    return JSON.stringify(tnArray);
  }

  updateFmFmNumber($event){
    this.fmFmNumber = $event.currentTarget.value
    let strippedTn = this.fmFmNumber.replace(/[^0-9.]/g, "");
    this.fmFmNumberLength = strippedTn.length;
  }

  strippedFmFmNumber(){
    return this.fmFmNumber.replace(/[^0-9.]/g, "");
  }

  setFmFmNumber($event){
    this.saving = true;
    this.setNumbers(this.strippedFmFmNumber())
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

  closeModal(){
    if (this.modalService.hasOpenModals()){
      this.modalRef.close();
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
