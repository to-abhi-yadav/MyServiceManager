// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Libraries
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DragulaModule } from 'ng2-dragula';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileSaverModule } from 'ngx-filesaver';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { DeviceDetectorModule } from 'ngx-device-detector';

// Project Components/Files
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './users/registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VoicemailComponent } from './voicemail/voicemail.component';
import { VoicemailItemComponent } from './voicemail/voicemail-item/voicemail-item.component';
import { VoicemailSettingsComponent } from './voicemail/voicemail-settings/voicemail-settings.component';
import { UserRegistrationComponent } from './admin/user-registration/user-registration.component';
import { InternationalminutesComponent } from './internationalminutes/internationalminutes.component';
import { AnonymousCallRejectionComponent } from './anonymous-call-rejection/anonymous-call-rejection.component';
import { CallRecordsComponent } from './call-records/call-records.component';
import { CallRecordItemComponent } from './call-records/call-record-item/call-record-item.component';
import { AllCallForwardingComponent } from './all-call-forwarding/all-call-forwarding.component';
import { CallForwardingBusyComponent } from './call-forwarding-busy/call-forwarding-busy.component';
import { CallForwardingNoAnswerComponent } from './call-forwarding-no-answer/call-forwarding-no-answer.component';
import { SelectiveCallAcceptanceComponent } from './selective-call-acceptance/selective-call-acceptance.component';
import { SelectiveCallRejectionComponent } from './selective-call-rejection/selective-call-rejection.component';
import { FindMeFollowMeComponent } from './find-me-follow-me/find-me-follow-me.component';
import { SpeedDialingComponent } from './speed-dialing/speed-dialing.component';
import { UnavailableCallForwardingComponent } from './unavailable-call-forwarding/unavailable-call-forwarding.component';
import { DoNotDisturbComponent } from './do-not-disturb/do-not-disturb.component';
import { DataUsageComponent } from './data-usage/data-usage.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { BillingManagementComponent } from './billing-management/billing-management.component';
import { PaymentFormComponent } from './billing-management/payment-form/payment-form.component';
import { OneTimePaymentComponent } from './billing-management/one-time-payment/one-time-payment.component';
import { AutopayComponent } from './billing-management/autopay/autopay.component';
import { AutopayFormComponent } from './billing-management/autopay-form/autopay-form.component';
import { AutoAttendantComponent } from './auto-attendant/auto-attendant.component';
import { SetBusinessHoursComponent} from './auto-attendant/set-business-hours/set-business-hours.component';
import { SetHolidayDatesComponent } from './auto-attendant/set-holiday-dates/set-holiday-dates.component';
import { BrandingComponent } from './branding/branding.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ThreeDotComponentMenuComponent } from './three-dot-component-menu/three-dot-component-menu.component';
import { CallRecordsPageComponent } from './call-records-page/call-records-page.component';
import { UserAdminComponent } from './admin/user-admin/user-admin.component';
import { SimRingComponent } from './sim-ring/sim-ring.component';
import { HuntingComponent } from './hunting/hunting.component';
import { SixDotDragComponent } from './six-dot-drag/six-dot-drag.component';
import { RegularBusinessHoursComponent } from './auto-attendant/regular-business-hours/regular-business-hours.component';
import { OffBusinessHoursComponent } from './auto-attendant/off-business-hours/off-business-hours.component';
import { HolidaysComponent } from './auto-attendant/holidays/holidays.component';
import { TooltipIconComponent } from './tooltip-icon/tooltip-icon.component';
import { PasswordResetComponent } from './users/password-reset/password-reset.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { IncompatibleBrowserComponent } from './incompatible-browser/incompatible-browser.component';
import { RegistrationConversionComponent } from './users/registration-conversion/registration-conversion.component';

// Material Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

// Services
import { AuthorizationHeaderService } from './shared/services/authorization-header.service';
import { AuthorizationService } from './shared/services/authorization.service';
import { UserService } from './users/user.service';
import { EmptyObjectService } from './shared/services/empty-object.service'
import { BrandingOptionsService } from './branding/branding-options.service';
import { BrandingService } from './shared/services/branding.service';
import { RegistrationService } from './admin/user-registration/registration.service';

// Pipes
import { PhonePipe } from './shared/pipes/phone.pipe';
import { TrustPipe } from './shared/pipes/trust.pipe';
import { SupportTokenComponent } from './support-token/support-token.component';
import { ComplexComponent } from './complex/complex.component';
import { HcSupportTokenComponent } from './hc-support-token/hc-support-token.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    VoicemailComponent,
    VoicemailItemComponent,
    VoicemailSettingsComponent,
    PhonePipe,
    UserRegistrationComponent,
    TrustPipe,
    InternationalminutesComponent,
    AllCallForwardingComponent,
    CallForwardingBusyComponent,
    SelectiveCallAcceptanceComponent,
    SelectiveCallRejectionComponent,
    FindMeFollowMeComponent,
    SpeedDialingComponent,
    UnavailableCallForwardingComponent,
    AnonymousCallRejectionComponent,
    CallRecordsComponent,
    CallRecordItemComponent,
    DoNotDisturbComponent,
    AllCallForwardingComponent,
    DataUsageComponent,
    BrandingComponent,
    SidebarComponent,
    ThreeDotComponentMenuComponent,
    CallForwardingNoAnswerComponent,
    InvoicesComponent,
    CallRecordsPageComponent,
    AutoAttendantComponent,
    SetBusinessHoursComponent,
    SetHolidayDatesComponent,
    UserAdminComponent,
    CallRecordsPageComponent,
    BillingManagementComponent,
    PaymentFormComponent,
    OneTimePaymentComponent,
    AutopayComponent,
    AutopayFormComponent,
    SimRingComponent,
    HuntingComponent,
    SixDotDragComponent,
    RegularBusinessHoursComponent,
    OffBusinessHoursComponent,
    HolidaysComponent,
    TooltipIconComponent,
    PasswordResetComponent,
    UserSettingsComponent,
    IncompatibleBrowserComponent,
    SupportTokenComponent,
    ComplexComponent,
    RegistrationConversionComponent,
    HcSupportTokenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    ImageCropperModule,
    DragulaModule.forRoot(),
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    ColorPickerModule,
    FileSaverModule,
    NgxAudioPlayerModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    FormsModule,
    AuthorizationService,
    UserService,
    BrandingOptionsService,
    EmptyObjectService,
    BrandingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationHeaderService,
      multi: true
    }
  ],
  entryComponents: [
    AllCallForwardingComponent,
    AnonymousCallRejectionComponent,
    CallForwardingBusyComponent,
    CallRecordsComponent,
    FindMeFollowMeComponent,
    VoicemailComponent,
    SelectiveCallAcceptanceComponent,
    SelectiveCallRejectionComponent,
    SpeedDialingComponent,
    UnavailableCallForwardingComponent,
    DataUsageComponent,
    BillingManagementComponent,
    SimRingComponent,
    HuntingComponent,
    OffBusinessHoursComponent, 
    SetBusinessHoursComponent,
    HolidaysComponent,
    DoNotDisturbComponent,
    InternationalminutesComponent,
    CallForwardingNoAnswerComponent,
    ComplexComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(fas, far);
  }
}
