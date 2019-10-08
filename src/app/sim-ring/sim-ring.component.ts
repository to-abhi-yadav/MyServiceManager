import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../users/user';
import { SimRingService } from './sim-ring.service';
import { UserService } from '../users/user.service';
import { PhonePipe } from "../shared/pipes/phone.pipe";
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sim-ring',
  templateUrl: './sim-ring.component.html',
  styleUrls: ['./sim-ring.component.scss'],
  providers: [SimRingService]
})
export class SimRingComponent implements OnInit {

  component = 'SimRingComponent'
  currentUser: User;
  isInitializing: boolean = true;
  isEnabled: Boolean = false;
  isToggling: Boolean = false;
  simRingNumber: string = '';
  simRingNumberLength: number = 0;
  phoneNumbers: string[] = [];
  hasPhoneNumbers: boolean = true;
  lastDeletedTn: string = ''
  saving: boolean = false;
  isLoadingRules: boolean = false;
  isDeleting: Boolean = false;
  // modal related
  modalRef: NgbModalRef
  isModalOpen: boolean = false;
  hasError = false
  errorMsg = ''
  closeResult = ''
  subs = new Subscription()
  maxNumError: boolean
  tnExists: boolean

  constructor(private simRingService: SimRingService, private userService: UserService, private modalService: NgbModal) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue
    this.getSimRingSettings();
  }

  getSimRingSettings() {
    this.subs.add(
      this.simRingService.retrieveSimRingSettings(this.currentUser.selectedTn.number, this.currentUser.accountId)
        .pipe(take(1))
        .subscribe((data) => {
          const parsed = this.simRingService.parseXml(data);
          if (parsed["Response"]["Status"]["Code"] === "200") {
            const myData = parsed["Response"]["SwitchGetSimRing"]
            this.isEnabled = this.stringToBoolOrNull(myData.enabled)
          }
          if (this.isEnabled) {
            this.getSimRingRules();
          } else {
            this.isInitializing = false;
          }
        })
    )
  }

  getSimRingRules() {
    this.subs.add(
      this.simRingService.retrieveSimRingRules(this.currentUser.selectedTn.number, this.currentUser.accountId)
        .pipe(take(1))
        .subscribe((ruleData) => {
          const myRuleData = this.simRingService.parseXml(ruleData);
          if (myRuleData["Response"]["Status"]["Code"] === "200") {
            const ruleSet = myRuleData["Response"]["SwitchGetFindMeFollowMeRules"]
            if (typeof ruleSet !== "object" && ruleSet["FindMeFollowMeRule"].length > 1) {
              ruleSet["FindMeFollowMeRule"].map((rule) => {
                let num = rule["number_to_ring"];
                if (num.length > 10) {
                  num = num.substring(1);
                }
                this.phoneNumbers.push(num)
              })
              this.hasPhoneNumbers = true;
            } else if (typeof ruleSet["FindMeFollowMeRule"] === "object") {
              if (ruleSet["FindMeFollowMeRule"] && ruleSet["FindMeFollowMeRule"]["number_to_ring"]) {
                let num = ruleSet["FindMeFollowMeRule"]["number_to_ring"];
                if (num.length > 10) {
                  num = num.substring(1);
                }
                this.phoneNumbers.push(num)
                this.hasPhoneNumbers = true;
              } else {
                this.hasPhoneNumbers = false;
              }
            } else {
              // Error
              this.hasPhoneNumbers = false;
            }
          }
          this.isInitializing = false;
          this.isLoadingRules = false;
        })
    )
  }

  toggleEnabledStatus() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      // First delete all numbers, then disable
      this.simRingService.DeleteAllSimRingRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
        this.simRingService.setSimRingSettings(this.currentUser.selectedTn.number, this.currentUser.accountId, this.isEnabled)
          .subscribe((data) => {
            this.isToggling = false;
            this.isLoadingRules = true;
            this.getSimRingRules();
            // // Get the SimRingRules & display
            // this.simRingService.retrieveSimRingRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {

            //   // Check data, if returns anything display it, otherwise display "You have no sim ring rules set up"
            //   this.isLoadingRules = false;
            // })
          }, (error) => {
            this.hasError = true;
            this.errorMsg = "The request could not be processed!"
          })
      })
    } else {
      this.isToggling = true;
      // Turn Selective Call Acceptance On/Off.
      this.simRingService.setSimRingSettings(this.currentUser.selectedTn.number, this.currentUser.accountId, this.isEnabled).subscribe((data) => {
        this.isToggling = false;
        this.isLoadingRules = true;
        // Get the SimRingRules & display
        this.simRingService.retrieveSimRingRules(this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
          // Check data, if returns anything display it, otherwise display "You have no sim ring rules set up"
          this.isLoadingRules = false;
        })
      }, (error) => {
        this.hasError = true;
        this.errorMsg = "The request could not be processed!"
      })
    }
  }

  deleteNumber(tn) {
    this.lastDeletedTn = tn;
    this.isToggling = true;
    this.subs.add(
      this.simRingService.DeleteAllSimRingRules(this.currentUser.selectedTn.number, this.currentUser.accountId)
        .pipe(take(1))
        .subscribe((data) => {
          // If successful, remove the deleted TN from the array
          const index = this.phoneNumbers.indexOf(this.lastDeletedTn, 0);
          if (index > -1) {
            this.phoneNumbers.splice(index, 1);
          }

          if (this.phoneNumbers.length >= 1) {
            this.setNumbers(null)
          } else {
            this.hasPhoneNumbers = false;
          }
          this.isToggling = false;
        })
    )
  }

  setNumbers(tn) {
    // Setup the data structure for the array of objects BR needs
    let tnArray = []
    this.phoneNumbers.map((num, index) => {
      let obj = { "tn": num }
      tnArray.push(obj)
    });
    if (tn !== null) {
      tnArray.push({ "tn": tn })
    }
    this.subs.add(
      this.simRingService.AddSimRingRules(this.currentUser.selectedTn.number, this.currentUser.accountId, JSON.stringify(tnArray))
        .pipe(take(1))
        .subscribe((data) => {
          debugger
          if (tn !== null) {
            this.phoneNumbers.push(tn);
          }
          if (this.phoneNumbers.length > 0) {
            this.hasPhoneNumbers = true;
          }
          this.closeModal();
          this.simRingNumber = ''
          this.saving = false;
        }, (error) => {
          // if error
        })
    )
  }

  updateSimRingNumber($event) {
    this.simRingNumber = $event.currentTarget.value
    let strippedTn = this.simRingNumber.replace(/[^0-9.]/g, "");
    this.simRingNumberLength = strippedTn.length;
  }

  strippedSimRingNumber() {
    return this.simRingNumber.replace(/[^0-9.]/g, "");
  }

  setSimRingNumber() {
    this.tnExists = false
    this.maxNumError = false
    this.saving = true;
    if (this.phoneNumbers)
      if (this.phoneNumbers.length >= 3) {
        this.saving = false
        this.maxNumError = true
        return
      }
    const newTn = this.strippedSimRingNumber()
    const found = this.checkIfTnAlreadyExists(newTn)
    if (found) {
      this.tnExists = true
      this.saving = false
    } else {
      this.setNumbers(newTn)
    }

  }

  checkIfTnAlreadyExists(newTn: string) {
    if (this.phoneNumbers.length > 0) {
      return this.phoneNumbers.includes(newTn)
    } else {
      return false
    }
  }

  public openLg(content) {
    this.hasError = false
    this.modalRef = this.modalService.open(content, { size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title' })
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeModal() {
    if (this.modalService.hasOpenModals()) {
      this.modalRef.close();
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  stringToBoolOrNull(str: string) {
    if (str == "True" || str == "TRUE" || str == "true") {
      return true;
    } else if (str == "False" || str == "FALSE" || str == "false") {
      return false;
    } else {
      return null;
    }
  }

}
