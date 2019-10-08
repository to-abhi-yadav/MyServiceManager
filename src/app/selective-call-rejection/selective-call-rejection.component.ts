import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { SelectiveCallRejectionService } from './selective-call-rejection.service'
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-selective-call-rejection',
  templateUrl: './selective-call-rejection.component.html',
  styleUrls: ['./selective-call-rejection.component.scss'],
  providers: [SelectiveCallRejectionService]
})
export class SelectiveCallRejectionComponent implements OnInit {
  component = 'SelectiveCallRejectionComponent'
  currentUser: User;
  isEnabled: Boolean = false;
  isToggling: Boolean = false;
  selectiveCallRejectionNumber: string = '';
  rejectedNumbers: string[] = [];
  saving: Boolean = false;
  isDeleting: Boolean = false;
  // modal related
  modalRef: NgbModalRef
  hasError = false
  errorMsg = ''
  closeResult = ''
  hasPhoneNumbers : Boolean = false;

  constructor(private scrService: SelectiveCallRejectionService, private userService: UserService, private modalService: NgbModal) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    this.scrService.retrieveSelectiveCallRejection(this.currentUser.token, this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe((data) => {
      let jsonResponse = this.scrService.parseXml(data);
      if (jsonResponse["Response"]["Status"]["Code"] == "200") {
        let obj = jsonResponse["Response"]["SwitchGetSelectiveCallRejection"];
        this.isEnabled = this.stringToBoolOrNull(obj["enabled"]);
        if (this.isEnabled == true) {
          this.getSelectiveCallRejectionNumbers();
          this.saving = false;
        }
      }
      else {
        this.hasError = true;
        this.errorMsg = 'Cannot check if Selective Call Rejection is enabled or not!';
      }
    })
  }

  toggleEnabledStatus() {
    this.isEnabled = !this.isEnabled;
    this.isToggling = true;
    // Turn Selective Call Rejection On/Off
    this.scrService.setSelectiveCallRejection(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      true,
      this.isEnabled).subscribe((data) => {
        this.isToggling = false;
        this.saving = false;
      }, (error) => {
        this.hasError = true;
        this.errorMsg = "The request could not be processed!"
      })
    // Get the Seletive Call Rejection Numbers if Selective Call Rejection is turned on.
    if (this.isEnabled == true) {
      this.getSelectiveCallRejectionNumbers();
    }
  }

  getSelectiveCallRejectionNumbers() {
    this.isToggling = true;
    this.scrService.retrieveSelectiveCallRejectionNumbers(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId).subscribe((data) => {
        let jsonResponse = this.scrService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          let obj = jsonResponse["Response"]["SwitchGetSelectiveCallRejectionNumbers"];
          // Need to check for empty object here before splitting
          const rejectedNumbers = obj["rejection_numbers"]
          const empty = this.isEmptyObject(rejectedNumbers)
          if (!empty) {
            this.rejectedNumbers = obj["rejection_numbers"].split(",")
            this.hasPhoneNumbers = true;
          }
          this.isToggling = false;
        }
      }
      )
  }

  isEmptyObject(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
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

  setSelectiveCallRejectionNumber() {
    this.selectiveCallRejectionNumber = this.formatNumber(this.selectiveCallRejectionNumber)
    this.hasError = false
    this.isToggling = true;
    this.saving = true;
    this.scrService.AddSelectiveCallRejectionNumber(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      this.selectiveCallRejectionNumber).subscribe((data) => {
        // Insert into the table.
        this.rejectedNumbers.push(this.selectiveCallRejectionNumber);
        this.selectiveCallRejectionNumber = '';
        this.saving = false;
        this.isToggling = false;
        this.hasPhoneNumbers = true;
        this.modalRef.close()
      }, (error) => {
        this.isToggling = false;
        this.hasError = true;
        this.errorMsg = "Cannot add the telephone number to Selective Call Rejection!"
        this.saving = false
      }
      )
  }

  deleteRejectionNumber(tn) {
    this.isDeleting = true;
    this.scrService.DeleteSelectiveCallRejectionNumber(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      tn).subscribe((data) => {
        // Delete from table.
        const index = this.rejectedNumbers.indexOf(tn, 0)
        if (index > -1) {
          this.rejectedNumbers.splice(index, 1)
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
    } else if (str == "False" || str == "FALSE" || str == "false") {
      return false;
    } else {
      return null;
    }
  }

  public openLg(content) {
    this.hasError = false
    this.modalRef = this.modalService.open(content, { size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title' })
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
      return `with: ${reason}`;
    }
  }

}
