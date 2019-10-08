import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/users/user';
import { PasswordValidator } from '../users/password-validator';
import { UserSettingsService } from './user-settings.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  providers: [UserSettingsService]
})
export class UserSettingsComponent implements OnInit {
  currentUser: User;
  user: User
  tns = [];
  newdefaultTN : String;
  emailResetForm: FormGroup;
  emailResetFormValues;
  submitting: boolean;
  emailSuccess: boolean;
  emailError: boolean;
  emailAlert: String = "";
  passwordResetForm: FormGroup;
  passwordResetFormValues;
  submittingPasswordReset: boolean;
  passwordSuccess: boolean;
  passwordError: boolean;
  passwordAlert: String = "";
  defaultTNResetForm: FormGroup;
  defaultTNResetFormValues;
  submittingDefaultTNReset: boolean;
  defaultTNSuccess: boolean;
  defaultTNError: boolean;
  defaultTNAlert: String = "";
  labelTN: String;
  labelSuccess: boolean;
  labelError: boolean;
  labelAlert: String = "";
  label: String = "";

  constructor(private fb: FormBuilder, 
    private usService: UserSettingsService, 
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute, 
    private storage: LocalStorageService) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    this.createEmailFormControls();
    this.createPasswordFormControls();
    this.createEmailForm();
    this.createPasswordForm();
    this.tns.length = 0
    this.tns = []
    this.currentUser.telephoneNumbers.forEach( numbers => {
      this.tns.push(numbers.tn)
    })
  }

  submitEmailForm() {
    this.submitting = true;
    this.usService.resetEmail(
      this.currentUser.token,
      this.emailResetForm.value.newemail).subscribe((data) => {
        let jsonResponse = this.usService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          this.emailSuccess = true;
          this.emailError = false;
          this.emailAlert = "Email has been updated successfully!";
        }
        else {
          this.emailError = true;
          this.emailSuccess = false;
          this.emailAlert = "Email could not be updated. Try again!";
        }
      }, (error) => {
        this.emailError = true;
        this.emailSuccess = false;
        this.emailAlert = "Email could not be updated. Try again!"
      })
  }

  submitPasswordResetForm() {
    this.submittingPasswordReset = true;
    this.usService.resetPassword(
      this.currentUser.token,
      this.passwordResetForm.value.currentpassword,
      this.passwordResetForm.value.newpassword).subscribe((data) => {
        let jsonResponse = this.usService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          this.passwordSuccess = true;
          this.passwordError = false
          this.passwordAlert = "Password has been updated successfully!";
        }
        else {
          this.passwordError = true;
          this.passwordSuccess = false;
          this.passwordAlert = "Password could not be updated. Try again!";
        }
      }, (error) => {
        this.passwordError = true;
        this.passwordSuccess = false;
        this.passwordAlert = "Password could not be updated. Try again!"
      })

  }

  setDefaultTN() {
    this.newdefaultTN = this.formatNumber(this.newdefaultTN);
    this.usService.resetDefaultTN(
      this.currentUser.token,
      this.newdefaultTN,
      this.currentUser.subId).subscribe((data) => {
        let jsonResponse = this.usService.parseXml(data);
        if (jsonResponse["Response"]["Status"]["Code"] == "200") {
          this.defaultTNSuccess = true;
          this.defaultTNError = false
          this.defaultTNAlert = "Default TN has been updated successfully!";
        }
        else {
          this.defaultTNError = true;
          this.defaultTNSuccess = false;
          this.defaultTNAlert = "Default TN could not be updated. Try again!";
        }
      }, (error) => {
        this.defaultTNError = true;
        this.defaultTNSuccess = false;
        this.defaultTNAlert = "Default TN could not be updated. Try again!"
      })
  }

  setLabel() {
    this.labelTN = this.formatNumber(this.labelTN);
    this.usService.resetLabel(
      this.currentUser.token,
      this.labelTN,
      this.currentUser.accountId,
      this.label).subscribe((data) => {
        let jsonResponse = this.usService.parseXml(data);
        if(jsonResponse["Response"]["Status"]["Code"] == "200") {
          this.tns.forEach( numbers => {
            if(numbers.number == this.labelTN) {
              numbers.label = this.label;
            }
          })
          this.labelSuccess = true;
          this.labelError = false;
          this.labelAlert = "Label for " + this.labelTN + " has been set to " + this.label
        }
        else {
          this.labelError = true;
          this.labelSuccess = false;
          this.labelAlert = "Label could not be updated!"
        }
      }, (error) => {
        this.labelError = true;
        this.labelSuccess = false;
        this.labelAlert = "Label could not be updated!"
      })
  }

  selectChangeHandler(event: any) {
    this.tns.forEach( numbers => {
      if(numbers.number == this.labelTN) {
        this.label = numbers.label;
      }
    })
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

  createEmailForm() {
    this.emailResetForm = this.fb.group(this.emailResetFormValues);
  }

  createEmailFormControls() {
    this.emailResetFormValues = {
      newemail: ['', Validators.compose([Validators.required, Validators.email])]
    }
  }

  createPasswordForm() {
    this.passwordResetForm = this.fb.group(this.passwordResetFormValues);
  }

  createPasswordFormControls() {
    this.passwordResetFormValues = {
      currentpassword: ['', Validators.compose([Validators.required])],
      newpassword: ['', Validators.compose([Validators.required, Validators.pattern(`^[a-zA-Z0-9!#^$%&()*+,./:=?@_{|}~]+$`)])],
      passwordConfirmation: ['', Validators.compose([Validators.required, PasswordValidator('newpassword')])]
    }
  }
}
