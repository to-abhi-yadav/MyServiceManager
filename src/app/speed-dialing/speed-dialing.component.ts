import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import Keyboard from "simple-keyboard";
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../users/user';
import { UserService } from '../users/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SpeedDialingService } from './speed-dialing.service';
import { EmptyObjectService } from '../shared/services/empty-object.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-speed-dialing',
  templateUrl: './speed-dialing.component.html',
  styleUrls: ['./speed-dialing.component.scss'] 
})

export class SpeedDialingComponent implements OnInit, AfterViewInit, OnDestroy {
  component = 'SpeedDialingComponent'
  hasError = false
  error = false
  errorMsg: string
  digitErrorMsg: string
  isEnabled = false
  isToggling = false
  value: number
  keyboard: Keyboard
  modalRef: NgbModalRef
  currentUser: User
  closeResult = ''
  speedDialForm: FormGroup
  speedDialFormValues
  speedDialCode: Number
  speedDialTns = []
  tns = []
  formatTn = ''
  speedDialCodeEnabled = false
  saveSpeedDialEnabled = false
  deletingSpeedDialNumber = false
  addingSpeedDialNumber = false
  subs = new Subscription()
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private fb: FormBuilder,
    private speedDialService: SpeedDialingService,
    private emptyObjectService: EmptyObjectService,
    private cd: ChangeDetectorRef
  ) { 
    this.currentUser = this.userService.currentUserValue
    this.currentUser.telephoneNumbers.forEach(number => this.tns.push(number.tn))
  }

  ngOnInit() {
    this.createFormControls()
    this.createForm()
    this.getSpeedDialing()
    this.getSpeedDialingNumbers()
    this.listenToFormChange()
  }

  speedDialCodeChange() {
    console.log(this.speedDialCode)
  }

  // service call methods begin
  getSpeedDialing() {
    this.subs.add(
      this.speedDialService.getSpeedDialing(this.currentUser.selectedTn.number, this.currentUser.accountId)
      .pipe(take(1))
      .subscribe( data => {
        const parsed = this.speedDialService.parseXml(data)
        this.isEnabled = this.stringToBoolOrNull(parsed['Response']['SwitchGetSpeedCalling']['enabled'])
        }
      )
    )
  }

  setSpeedDialing() {
    const enabled = !this.isEnabled
    this.subs.add(
      this.speedDialService.setSpeedDialing(this.currentUser.selectedTn.number, this.currentUser.accountId, enabled)
      .pipe(take(1))
      .subscribe( data => {
        const parsed = this.speedDialService.parseXml(data)
        if (parsed['Response']['Status']['Code'] === '200') {
          this.isEnabled = !this.isEnabled
          console.log(this.isEnabled)
        }
        }
      )
    )
  }

  getSpeedDialingNumbers() {
    this.subs.add(
      this.speedDialService.getSpeedDialingNumbers(this.currentUser.selectedTn.number, this.currentUser.accountId)
      .pipe(take(1))
      .subscribe( data => {
        const parsed = this.speedDialService.parseXml(data)
        this.speedDialTns = []
        this.speedDialTns.length = 0
        if (parsed['Response']['Status']['Code'] === '200') {
          const obj = parsed['Response']['SwitchGetSpeedCallingNumbers']
          const isEmpty = this.emptyObjectService.isEmptyObject(obj)
          if (!isEmpty) {
            const arr = Array.isArray(obj['SpeedCallingNumber'])
            console.log('isArray? = ', arr)
            if (!arr) {
              this.speedDialTns.push(obj['SpeedCallingNumber'])
            } else {
              obj['SpeedCallingNumber'].forEach(number => {
                this.speedDialTns.push(number)
              })
            } 
          } else {
            console.log('There are no speed dial numbers associated with this tn')
          }
        } else {
          console.log('There are no speed dial numbers associated with this tn')
        }
      }
    )
    )
  }

  addSpeedDialingNumber(speedCode, numberToCall) {
    this.addingSpeedDialNumber = true
    this.subs.add(
      this.speedDialService.addSpeedDialingNumber(this.currentUser.selectedTn.number, this.currentUser.accountId, speedCode, numberToCall)
      .pipe(take(1))
      .subscribe( data => {
        const parsed = this.speedDialService.parseXml(data)
        if (parsed['Response']['Status']['Code'] === '200' && parsed['Response']['SwitchAddSpeedCallingNumber']['result'] !== 'FAIL') {
          this.getSpeedDialingNumbers()
          this.closeModal()
          this.digitErrorMsg = null
          this.value = null
          this.keyboard.clearInput();
        } else {
          this.speedDialForm.get('selectedTn').setValue('')
          this.keyboard.clearInput();
          this.value = null
          console.log('There was an error adding that speed dial number')
          this.digitErrorMsg = 'The phone number or speed dial code you entered is already in use!'
          this.closeModal()
        }
        this.addingSpeedDialNumber = false
        }
      )
    )
  }

  deleteSpeedDialingNumber(speedCode, numberToCall) {
    this.deletingSpeedDialNumber = true
    this.subs.add(
      this.speedDialService.deleteSpeedDialingNumber(this.currentUser.selectedTn.number, this.currentUser.accountId, speedCode, numberToCall)
      .pipe(take(1))
      .subscribe( data => {
        const parsed = this.speedDialService.parseXml(data)
        console.log(parsed)
        if (parsed['Response']['Status']['Code'] === '200') {
          this.getSpeedDialingNumbers()
        } else {
          console.log('There was an error deleting that speed dial number')
        }
        this.deletingSpeedDialNumber = false
        }
      ) 
    )
  }
  // service call methods begin

  ngAfterViewInit() {
    let myInputPattern = /^\d+$/;
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", "0"]
      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      inputPattern: myInputPattern,
      maxLength: 2
    });
  }

  clearCode() {
    this.keyboard.clearInput()
    this.value = null
  }

  onChange = (input: string) => {
    const x = input
    const num = +x
    this.digitErrorMsg = null
    if (num > 9 && num < 20) {
      this.value = null
      this.keyboard.clearInput();
      this.digitErrorMsg = 'The speed dial code must be between 2 - 9 and 20 - 49'
    } else if (num > 49) {
      this.keyboard.clearInput();
      this.value = null
      this.digitErrorMsg = 'The speed dial code must be between 2 - 9 and 20 - 49'
    } else if (num < 2) {
      this.keyboard.clearInput();
      this.value = null
      this.digitErrorMsg = 'The speed dial code must be between 2 - 9 and 20 - 49'
    } else {
      this.speedDialCodeEnabled = true
      this.value = num;
    }
  };

  onKeyPress = (button: number) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    // if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  public openLg(content) {
    this.hasError = false
    this.modalRef = this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'})
    this.modalRef.result.then((result) => {
      console.log(result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeModal(){
    if (this.modalService.hasOpenModals()){
      this.speedDialForm.reset()
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

  saveSpeedDial() {
    const regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi
    const numberToCall = this.speedDialForm.value.selectedTn.replace(regex, "")
    const speedCode = this.value
    this.addSpeedDialingNumber(speedCode, numberToCall)
  }

  listenToFormChange() {
      this.speedDialForm.get('selectedTn').valueChanges.subscribe(number => {
        if (number) {
          const regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi
          const num = number.replace(regex, "")
          if (num.length === 10) {
            this.saveSpeedDialEnabled = true
          } else {
            this.saveSpeedDialEnabled = false
          }
        }
      });
  }

  createFormControls() {
    this.speedDialFormValues = {
      selectedTn: ['', Validators.compose([Validators.required])]
    }
  }
  
  createForm() {
    this.speedDialForm = this.fb.group(this.speedDialFormValues);
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

  ngOnDestroy() {
    this.subs.unsubscribe()
  }


}
