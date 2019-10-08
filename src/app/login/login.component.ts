import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../users/user.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { AuthorizationHeaderService } from '../shared/services/authorization-header.service';
import { LoginService } from './login.service';
import { User } from '../users/user';
import { AuthorizationService } from '../shared/services/authorization.service';
import { Branding } from '../shared/models/branding';
import { BrandingService } from '../shared/services/branding.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BrandingOptionsService } from '../branding/branding-options.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit {
  branding: Branding
  apiRoot: string
  submitting: boolean
  loginForm: FormGroup
  loginFormValues
  hasError = false
  loggedIn = false
  errorMsg: string
  validationMsg: string
  error: string
  account_validation_messages = {
    'userName': [
      { type: 'required', message: 'Username is required' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' }
    ]
  }

   deviceInfo = null

  // Branding Option Variables
  fontFamily: string
  logo: string
  taglineFontFamily: string
  taglineFontColor: string
  primaryFontColor: string
  secondaryFontColor: string
  primaryButtonColor: string
  secondaryButtonColor: string
  backgroundColor: string
  companyName: string


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private storage: LocalStorageService,
    private authService: AuthorizationService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private brandingService: BrandingService,
    private brandingOptionsService: BrandingOptionsService,
    public sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private deviceService: DeviceDetectorService
  ) {
    this.getDeviceInfo()
  }

  ngOnInit() {
    this.setBranding()
    this.createFormControls();
    this.createForm();
  }

  ngAfterViewInit() {
  }

  getDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log(this.deviceInfo)
    if (this.deviceInfo.browser === 'IE') {
      // window.alert('This application does not support Internet Explorer.  Please download Chrome, Firefox, or open in Microsoft Edge.')
      // window.open('../../../static-pages/internet-explorer.html')
    }
  }
  

  setBranding() {
    const hostName = window.location.hostname
    this.brandingService.setAllBranding(hostName).subscribe( data => {
      if (data) {
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
    if (this.loginForm.invalid) {
      this.hasError = true
      return;
    }
    this.loginService.login(this.loginForm.value).subscribe( data => {
      if (data['Response']['Status']['Code'] === 200) {
        const response = data['Response']['UserToken']
        const token = response['Token']
        const expiryDate = response['ExpiryDate']
        const userProfile = response['UserProfile'];
        const type = response['UserType']
        const company = response['Company']
        const accountId = response['AccountID']
        const componentSequence = response['Component_Sequence']
        const subId = response['SubID']
        const defaultTn = response['Default_TN']
        const telephoneNumbers = response["TelephoneNumbers"]
        const br = response['Branding']
        let forwardingUrl
        if (response['UserType'] === 'partner_admin') {
          forwardingUrl = br['forwarding_url']
        } else {
          forwardingUrl = ''
        }
        const branding = {
          fontFamily: br['font_family'], 
          logo: br['logo'], 
          taglineFontFamily: br['tagline_font_family'],
          taglineFontColor: '#' + br['tagline_font_color'],
          primaryFontColor: '#' + br['primary_font_color'],
          secondaryFontColor: '#' + br['secondary_font_color'],
          primaryButtonColor: '#' + br['primary_button_color'],
          secondaryButtonColor: '#' + br['secondary_button_color'],
          backgroundColor: '#' + br['background_color'],
          companyName: br['comnpanyname'],
          forwardingUrl: forwardingUrl
        }
        let sn
        if (defaultTn) {
          sn = telephoneNumbers.filter(number => number["tn"]["number"] == defaultTn)[0]['tn']
        } else if (telephoneNumbers){
          sn = telephoneNumbers[0]['tn']
        } else {
          sn = ''
        }
      
        const user = {
          token: token, 
          userProfile: userProfile,
          expiryDate: expiryDate, 
          type: type, 
          userName: this.loginForm.value.userName,
          company: company, 
          accountId: accountId, 
          componentSequence: componentSequence, 
          subId: subId,
          telephoneNumbers: telephoneNumbers,
          selectedTn: sn,
          branding: branding
        }

        const newUser = new User(user)
        this.authService.handleAuthEvent(newUser)
        this.userService.setCurrentUser(newUser)
        if (newUser.type === 'partner_admin') {
          this.router.navigate(['/branding-options'])
        } else if (newUser.type === 'user_admin') {
          this.router.navigate(['/admin/user-admin'])
        } else {
          this.router.navigate(['/dashboard'])
        }
      } else {
        this.hasError = true 
        this.errorMsg = 'Username or Password is Incorrect!'
      }
      this.submitting = false
    }, error => {
      const errorCode = error.error.Response.Status.Code
      if (errorCode) {
        if (errorCode === 451) {
          // unauthorized access
          this.hasError = true
          this.errorMsg = 'No Matching Account. Username or Password is Incorrect!'
        } else if (errorCode === 416 || errorCode === 415) {
          this.hasError = true
          this.errorMsg = "Please make sure that the information you have entered into the form is correct."
        } else if (errorCode === 453 || errorCode === 452 ) {
          this.hasError
          this.errorMsg = "No Matching Account. Username or Password is Incorrect!"
        } else if (errorCode === 400) {
          this.hasError = true
          this.errorMsg = "No Matching Account. Please make sure that the information you have entered into the form is correct."
        }
      }
      this.submitting = false
    })
  }

  createFormControls() {
    this.loginFormValues = {
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    }
  }
  
  createForm() {
    this.loginForm = this.fb.group(this.loginFormValues);
  }

  forgotPassword(){
    debugger
  }

}
