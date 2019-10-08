import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HcSupportTokenService } from '../hc-support-token/hc-support-token.service';
import { User } from '../users/user';
import { UserService } from '../users/user.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { AuthorizationHeaderService } from '../shared/services/authorization-header.service';
import { AuthorizationService } from '../shared/services/authorization.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Branding } from '../shared/models/branding';
import { BrandingService } from '../shared/services/branding.service';
import { BrandingOptionsService } from '../branding/branding-options.service';

@Component({
  selector: 'app-hc-support-token',
  templateUrl: './hc-support-token.component.html',
  styleUrls: ['./hc-support-token.component.scss'],
  providers: [HcSupportTokenService]
})
export class HcSupportTokenComponent implements OnInit {

  supportToken : String;
  isRedirecting : Boolean = false;
  msg : String = "";

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private storage: LocalStorageService,
    private authService: AuthorizationService,
    private router: Router,
    public sanitizer: DomSanitizer,
    private brandingService: BrandingService,
    private brandingOptionsService: BrandingOptionsService,
    private cd: ChangeDetectorRef,
    private supportTokenService: HcSupportTokenService) {}

  ngOnInit() {
    localStorage.clear();
    this.route.queryParams.subscribe(params => {
      this.supportToken = params["supportToken"];
      }
    )
    this.isRedirecting = true;
    console.log(this.supportToken);
    this.supportTokenService.callSupportToken(this.supportToken).subscribe(data => {
      if (data['Response']['Status']['Code'] === 200) {
        this.msg = "Redirecting!";
        const response = data['Response']['UserToken']
        const token = response['Token']
        const expiryDate = response['ExpiryDate']
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

        // Set branding.
        this.brandingOptionsService.setCurrentBranding(branding)
        const logo = branding.logo
        const companyName = branding.companyName
        const setLogoRes = this.brandingService.setLogoAndName(logo, companyName)
        const brandingSetRes = this.brandingService.setBrandingOptions(branding)
        this.cd.markForCheck()
        console.log(logo);

        // Get Username.
        const userName = response['Username'];
      
        const user = {
          token: token, 
          expiryDate: expiryDate, 
          type: type, 
          userName: userName,
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
        this.msg = "Failed to Redirect!"
      }
    })
  }

}
