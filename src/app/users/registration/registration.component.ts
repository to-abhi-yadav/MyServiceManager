import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthorizationService } from 'src/app/shared/services/authorization.service';
import { LoginService } from 'src/app/login/login.service';
import { UserRegistrationService } from './user-registration.service';
import { User } from 'src/app/users/user';
import { PhonePipe } from 'src/app/shared/pipes/phone.pipe';
import { stateList } from '../stateList'
import { PasswordValidator } from '../password-validator'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [ PhonePipe ]
})

export class RegistrationComponent implements OnInit {
  states = stateList
  apiRoot: string
  submitting: boolean
  registrationForm: FormGroup
  registrationFormValues
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
  teststring: string
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
    private registrationService: UserRegistrationService,
    private phonePipe: PhonePipe
  ) { }
  
  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getAndSetUri();
    this.route.queryParams.subscribe(params => {
      let username = params["username"] === undefined ? "": params["username"];
      let email = params["email"] === undefined ? "": params["email"];
      let subid = params["subid"] === undefined ? "": params["subid"];
      let phone = params["phone"] === undefined ? "": params["phone"];
      let state = params["state"] === undefined ? "": params["state"];
      let zipcode = params["zipcode"] === undefined ? "": params["zipcode"];

      this.registrationForm.patchValue({
        userName: username,
        email: email,
        subId: subid,
        phone: phone,
        state: state,
        zipCode: zipcode,
      }); 
      }
    )
    //console.log(this.registrationForm.value)
    // console.log("Look here bud");
    // console.log(this.registrationForm.controls.userName.value);
  }

  submitForm() {
    this.errorMsg = null
    this.submitting = true
    const phn = this.stripNumber(this.registrationForm.value.phone)
    if (phn.length !== 10) {
      this.hasError = true
      this.registrationForm.get('phone').setErrors({'invalid': true, 'maxlength': true})
      this.submitting = false
      return
    }
    if (this.registrationForm.invalid) {
      this.hasError = true
      this.submitting = false
      return
    }
    this.registrationForm.value.phone = this.stripNumber(this.registrationForm.value.phone)
    this.registrationService.register(this.registrationForm.value).subscribe( data => {
      const json = this.registrationService.parseXml(data) 
      if (json['Response']['Status']['Code'] === '200') {
        this.registrationForm.reset()
        this.successMsg = 'User Sucessfully Added!'
        this.router.navigate(['/login'])
      } else {
        this.hasError = true 
        this.errorMsg = 'User registration failed!'
      }
      this.submitting = false
    }, error => {
      const errorCode = error.status
      if (errorCode) {
        if (errorCode === 451) {
          // unauthorized access
          this.hasError = true
          this.errorMsg = 'No Matching Account. Please make sure that the information you have entered into the form is correct.'
        } else if (errorCode === 416 || errorCode === 415) {
          this.hasError = true
          this.errorMsg = "No Matching Account. Please make sure that the information you have entered into the form is correct."
        } else if (errorCode === 453 || errorCode === 452 ) {
          this.hasError = true
          this.errorMsg = "No Matching Account. Please make sure that the information you have entered into the form is correct."
        } else if (errorCode === 400) {
          this.hasError = true
          this.errorMsg = "No Matching Account. Please make sure that the information you have entered into the form is correct."
        }
      }
      this.submitting = false
    })
  }

  createFormControls() {
    this.registrationFormValues = {
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
    this.registrationForm.get('uri').setValue(window.location.hostname)
  }
  
  createForm() {
    this.registrationForm = this.fb.group(this.registrationFormValues);
  }

  private stripNumber(number){
    number = number.replace(/[^0-9.]/g, "");
    return number
  }

}
