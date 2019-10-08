import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthorizationService } from 'src/app/shared/services/authorization.service';
import { LoginService } from 'src/app/login/login.service';
import { RegistrationService } from './registration.service';
import { User } from 'src/app/users/user';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
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
      { type: 'required', message: 'Subscription Id is required' }
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
    private registrationService: RegistrationService
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  submitForm() {
    this.errorMsg = null
    this.submitting = true
    if (this.registrationForm.invalid) {
      this.hasError = true
      return;
    }
    this.registrationService.register(this.registrationForm.value).subscribe( data => {
      const json = this.registrationService.parseXml(data) 
      if (json['Response']['Status']['Code'] === '200') {
        this.successMsg = 'User Sucessfully Added!'
      } else {
        this.hasError = true 
        this.errorMsg = 'Username or Password is Incorrect!'
      }
    })
  }

  createFormControls() {
    this.registrationFormValues = {
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      subId: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      company: ['', Validators.compose([Validators.required])],
      zipCode: ['', Validators.compose([Validators.required])]
    }
  }
  
  createForm() {
    this.registrationForm = this.fb.group(this.registrationFormValues);
  }

  forgotPassword(){
    debugger
  }

}
