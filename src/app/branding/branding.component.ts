import { Component, OnInit, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { UserService } from '../users/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl
} from "@angular/forms";
import { LocalStorageService } from '../shared/services/local-storage.service';
import { User } from '../users/user';
import { BrandingOptionsService } from './branding-options.service';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit {
  user: User
  brandingOptionsForm: FormGroup
  submitting: boolean
  submitted: boolean
  imgSrc = ""
  imageChangedEvent: any = ""
  croppedImage: any = ""
  fonts = ['Open-Sans', 'Lato']
  colorTypes = ['Hex', 'RGBA']
  hasError: boolean
  errorMsg: string

  logoChangedEvent: Event;
  logoCropped: string;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private storage: LocalStorageService,
    private currentRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private brandingOptionsService: BrandingOptionsService,
    private render: Renderer2,
    private elRef: ElementRef,
  ) { }

  ngOnInit() {
    this.user = this.storage.getItem('currentUser')
    this.render.addClass(this.elRef.nativeElement.parentElement, 'no-scroll')
    this.buildForm()
    this.setValuesInForm(this.user.branding)
  }

  buildForm() {
    this.brandingOptionsForm = this.fb.group({
      logo: [""],
      tagline: [""],
      taglineFont: [""],
      taglineFontColorType: [""],
      taglineFontColor: [""],
      fontFamily: [""],
      primaryFontColorType: [""],
      primaryFontColor: [""],
      secondaryFontColorType: [""],
      secondaryFontColor: [""],
      primaryButtonColor: [""],
      secondaryButtonColor: [""],
      forwardingUrl: [""],
      domainName:  [""],
      backgroundColor: [""]
    })
  }


  onSelectLogo($event: Event): void {
    this.logoChangedEvent = $event;
  }

  onLogoCropChanged($event: string) {
    this.logoCropped = $event;
  }

  onLogoCropClicked() {
    this.brandingOptionsForm.get('logo').setValue(this.logoCropped);
    this.logoChangedEvent = null;
  }

  onRemoveLogo() {
    this.brandingOptionsForm.get('logo').setValue(null);
  }

  setValuesInForm(data) {
    this.brandingOptionsForm.get("logo").setValue(data.logo);
    this.brandingOptionsForm.get("tagline").setValue(data.tagline);
    this.brandingOptionsForm.get("taglineFont").setValue(data.taglineFontFamily);
    this.brandingOptionsForm.get("taglineFontColor").setValue(data.taglineFontColor);
    this.brandingOptionsForm.get("fontFamily").setValue(data.fontFamily);
    this.brandingOptionsForm.get("primaryFontColor").setValue(data.primaryFontColor);
    this.brandingOptionsForm.get("secondaryFontColor").setValue(data.secondaryFontColor);
    this.brandingOptionsForm.get("primaryButtonColor").setValue(data.primaryButtonColor);
    this.brandingOptionsForm.get("secondaryButtonColor").setValue(data.secondaryButtonColor);
    this.brandingOptionsForm.get("forwardingUrl").setValue(data.forwardingUrl);
    // this.brandingOptionsForm.get("domainName").setValue(data.domain_name);
    this.brandingOptionsForm.get("backgroundColor").setValue(data.backgroundColor);
    this.cd.markForCheck()
  }

  saveBrandingOptions() {
    this.errorMsg = null
    this.submitting = true
    if (this.brandingOptionsForm.invalid) {
      this.hasError = true
      return;
    }
    let params
    if (this.croppedImage) {
      params = {company: this.user.company, form: this.brandingOptionsForm.value, image: this.logoCropped}
    } else {
      params = {company: this.user.company, form: this.brandingOptionsForm.value}
    }
    console.log('Params = ', params)
    this.brandingOptionsService.setBrandingOptions(params).subscribe( data => {
      // const parsed = this.brandingOptionsService.parseXml(data)
      console.log(data) //Status: {Code: "200", Message: "Success"}
      if (data['Response']['Status']['Code'] === 200) {
        // success
        this.submitted = true
        this.submitting = false
        this.userService
      } else {
        // failure
        this.submitted = true
        this.submitting = false
        this.hasError = true
      }
    })
  }

}
