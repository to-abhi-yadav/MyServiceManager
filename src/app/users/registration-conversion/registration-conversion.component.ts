import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthorizationService } from 'src/app/shared/services/authorization.service';
import { LoginService } from 'src/app/login/login.service';
import { UserRegistrationService } from '../registration/user-registration.service';
import { User } from 'src/app/users/user';
import { PhonePipe } from 'src/app/shared/pipes/phone.pipe';
import { stateList } from '../stateList';
import { PasswordValidator } from '../password-validator';
import { Branding } from '../../shared/models/branding';
import { BrandingService } from '../../shared/services/branding.service';
import { BrandingOptionsService } from '../../branding/branding-options.service';

@Component({
  selector: 'app-registration-conversion',
  templateUrl: './registration-conversion.component.html',
  styleUrls: ['./registration-conversion.component.scss'],
  providers: [ PhonePipe ]
})
export class RegistrationConversionComponent implements OnInit {

  branding: Branding
  logo: string
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
  conversionMsg: string
  phase: string
  hostName = window.location.hostname

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
    private phonePipe: PhonePipe,
    private brandingService: BrandingService,
    private brandingOptionsService: BrandingOptionsService,
    private cd: ChangeDetectorRef
  ) { }
  
  ngAfterViewInit() {
    //this.setBranding();
  }
  ngOnInit() {
    //console.log("Testing3");
    this.setBranding();
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
      this.phase = params["phase"] === undefined ? '': params["phase"];

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

    if (this.phase === "1") {
      this.conversionMsg = "Please create your new account to get started!  We are excited to release a new customizable website" +
       " to manage your telephone number and features.  After you create your account, you will be able to login at " +
      this.hostName + "." +
       " Please enter any information below that is not populated and begin exploring your new service manager.";
    } else if(this.phase === "2") {
      this.conversionMsg = "The current management website for your telephone service has now been migrated to a new location." + 
      " We are excited to release a new customizable website to manage your telephone number and features.  Please complete this" + 
      " registration page to create your account in order to get started!  After you create your account," + 
      " you will be able to login at " + this.hostName + ". ";
    } else {
      this.conversionMsg = "";
    }

    // console.log(this.registrationForm.value)
    // console.log("Look here bud");
    // console.log(this.registrationForm.controls.userName.value);
  }

  setBranding() {
    const hostName = window.location.hostname
    this.brandingService.setAllBranding(hostName).subscribe( data => {
      if (data) {
        debugger;
        const parsed = this.brandingService.parseXml(data)
        const brandingObj = parsed["Response"]["Branding"]
        const branding = new Branding({
          fontFamily: brandingObj['font_family'], 
          logo: brandingObj['logo'], 
          taglineFontFamily: brandingObj['tagline_font_family'], 
          taglineFontColor: '#' + brandingObj['tagline_font_color'], 
          primaryFontColor: '#' + brandingObj['primary_font_color'], 
          secondaryFontColor: '#' + brandingObj['secondary_font_color'], 
          primaryButtonColor: '#' + brandingObj['primary_button_color'], 
          secondaryButtonColor: '#' + brandingObj['secondary_button_color'], 
          backgroundColor: '#' + brandingObj['background_color'], 
          companyName: brandingObj['company_name']
        })
        this.brandingOptionsService.setCurrentBranding(branding)
        const logo = branding.logo
        this.logo = branding.logo
        const companyName = branding.companyName
        const setLogoRes = this.brandingService.setLogoAndName(logo, companyName)
        const brandingSetRes = this.brandingService.setBrandingOptions(branding)
        console.log(this.logo)
        this.cd.markForCheck()
      }
    }
    )
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
