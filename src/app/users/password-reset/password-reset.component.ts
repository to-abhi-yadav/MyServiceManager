import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthorizationService } from 'src/app/shared/services/authorization.service';
import { LoginService } from 'src/app/login/login.service';
import { PasswordResetService } from './password-reset.service';
import { User } from 'src/app/users/user';
import { PhonePipe } from 'src/app/shared/pipes/phone.pipe';
import { stateList } from '../stateList'
import { PasswordValidator } from '../password-validator'

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  providers: [ PhonePipe ]
})

export class PasswordResetComponent implements OnInit {
  states = stateList
  apiRoot: string
  submitting: boolean
  passwordResetForm: FormGroup
  passwordResetFormValues
  hasError = false
  loggedIn = false
  errorMsg: string
  validationMsg: string
  error: string
  successMsg: string
  showPasswordErrorMsg: boolean
  passwordError: string
  enableSubmit: boolean
  showEmailErrorMsg: boolean
  emailError: string
  account_validation_messages = {
    'userName': [
      { type: 'required', message: 'Username is required' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' }
    ],
    'phone': [
      { type: 'required', message: 'Phone Number is required' }
    ],
    'subId': [
      { type: 'required', message: 'Account Number is required' }
    ],
    'company': [
      { type: 'required', message: 'Company is required' }
    ],
    'state': [
      { type: 'required', message: 'State is required' }
    ],
    'zipCode': [
      { type: 'required', message: 'Zip Code is required' }
    ]
  }
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private storage: LocalStorageService,
    private authService: AuthorizationService,
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService,
    private phonePipe: PhonePipe
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getAndSetUri()
  }

  submitForm() {
    this.hasError = false
    this.errorMsg = null
    this.submitting = true
    const phn = this.stripNumber(this.passwordResetForm.value.phone)
    if (phn.length !== 10) {
      this.hasError = true
      this.passwordResetForm.get('phone').setErrors({'invalid': true, 'maxlength': true})
      this.submitting = false
      return;
    }
    if (this.passwordResetForm.invalid) {
      this.hasError = true
      this.submitting = false
      return;
    }
    this.passwordResetForm.value.phone = this.stripNumber(this.passwordResetForm.value.phone)
    this.passwordResetService.reset(this.passwordResetForm.value).subscribe( data => {
      const json = this.passwordResetService.parseXml(data) 
      if (json['Response']['Status']['Code'] === '200') {
        this.successMsg = 'Your account was successfully updated with your new password!'
        this.router.navigate(['/login'])
      } else {
        this.hasError = true 
        this.errorMsg = 'Your password reset request failed'
      }
      this.submitting = false
    }, error => {
        const errorCode = error.status
        if (errorCode) {
          if (errorCode === 451) {
            // unauthorized access
            this.hasError = true
            this.errorMsg = 'Username or Password is Incorrect!'
          } else if (errorCode === 400) {
            // Bad Request
            this.hasError = true
            this.errorMsg = 'No Matching Account! Your password reset request failed. Please confirm that the account information you have entered into the form is correct.'
          } else if (errorCode === 454) {
            this.hasError = true
            this.errorMsg = 'No Matching Account! Your password reset request failed. Please confirm that the account information you have entered into the form is correct.'
          } 
        }
        this.submitting = false
    })
  }

  createFormControls() {
    this.passwordResetFormValues = {
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(`^[a-zA-Z0-9!#^$%&()*+,./:=?@_{|}~]+$`), Validators.minLength(8), Validators.maxLength(64)])],
      passwordConfirmation: ['', Validators.compose([Validators.required, PasswordValidator('password')])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required])],
      subId: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      zipCode: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)])],
      uri: ['']
    }
  }

  getAndSetUri() {
    this.passwordResetForm.get('uri').setValue(window.location.hostname)
  }
  
  createForm() {
    this.passwordResetForm = this.fb.group(this.passwordResetFormValues);
  }

  private stripNumber(number){
    number = number.replace(/[^0-9.]/g, "");
    return number
  }

}
