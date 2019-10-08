import { NgModule } from '@angular/core'
import { ExtraOptions, RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { RegistrationComponent } from './users/registration/registration.component';
import { RegistrationConversionComponent } from './users/registration-conversion/registration-conversion.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/services/auth.guard';
import { UserRegistrationComponent } from './admin/user-registration/user-registration.component';
import { AdminPermissionsGuard } from './admin/admin-permissions.guard';
import { InternationalminutesComponent} from './internationalminutes/internationalminutes.component';
import { DoNotDisturbComponent } from './do-not-disturb/do-not-disturb.component';
import { CallForwardingBusyComponent} from './call-forwarding-busy/call-forwarding-busy.component'
import { CallForwardingNoAnswerComponent } from './call-forwarding-no-answer/call-forwarding-no-answer.component'
import { SelectiveCallAcceptanceComponent } from './selective-call-acceptance/selective-call-acceptance.component'
import { SelectiveCallRejectionComponent } from './selective-call-rejection/selective-call-rejection.component'
import { BrandingComponent } from './branding/branding.component';
import { BrandingAdminGuard } from './branding/branding-admin.guard';
import { InvoicesComponent } from './invoices/invoices.component';
import { AutoAttendantComponent} from './auto-attendant/auto-attendant.component';
import { CallRecordsPageComponent } from './call-records-page/call-records-page.component';
import { CallRecordsPageGuard } from './call-records-page/call-records-page.guard';
import { UserAdminComponent } from './admin/user-admin/user-admin.component';
import { OneTimePaymentComponent } from './billing-management/one-time-payment/one-time-payment.component';
import { AutopayComponent } from './billing-management/autopay/autopay.component';
import { PasswordResetComponent } from './users/password-reset/password-reset.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { IncompatibleBrowserComponent } from './incompatible-browser/incompatible-browser.component';
import { SupportTokenComponent } from './support-token/support-token.component';
import { ComplexComponent } from './complex/complex.component';
import { HcSupportTokenComponent } from './hc-support-token/hc-support-token.component';

const routes: Routes = [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
        data: {navigation: 'false'}
      },
      {
        path: 'home',
        component: HomeComponent,
        data: { state: 'home', title: 'Big River | Home' }
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { navigation: 'false', state: 'login', title: 'Big River | Login' }
      },
      {
        path: 'signup',
        component: RegistrationComponent,
        data: { navigation: 'false', state: 'signup', title: 'Big River | Sign Up' }
      },
      {
        path: 'registration',
        component: RegistrationConversionComponent,
        data: { navigation: 'false', state: 'registration', title: 'Big River | Registration' }
      },
      {
        path: 'password-reset',
        component: PasswordResetComponent,
        data: { navigation: 'false', state: 'password-reset', title: 'Big River | Sign Up' }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { state: 'dashboard', title: 'Big River | Dashboard' }
      },
      {
        path: 'internationalminutes',
        component: InternationalminutesComponent,
        canActivate: [AuthGuard],
        data: { state: 'internationalminutes', title: 'Big River | International Minutes' }
      },
      {
        path: 'user-settings',
        component: UserSettingsComponent,
        canActivate: [AuthGuard],
        data: { state: 'usersettings', title: 'Big River | User Profile' }
      },
      {
        path: 'selectivecallacceptance',
        component: SelectiveCallAcceptanceComponent,
        canActivate: [AuthGuard],
        data: { state: 'selectivecallacceptance', title: 'Big River | Selective Call Acceptance' }
      },
      {
        path: 'selectivecallrejection',
        component: SelectiveCallRejectionComponent,
        canActivate: [AuthGuard],
        data: { state: 'selectivecallrejection', title: 'Big River | Selective Call Acceptance' }
      },
      {
        path: 'callforwardingbusy',
        component: CallForwardingBusyComponent,
        canActivate: [AuthGuard],
        data: { state: 'callforwardingbusy', title: 'Big River | Call Forwarding Busy' }
      },
      {
        path: 'autoattendant',
        component: AutoAttendantComponent,
        canActivate: [AuthGuard],
        data: { state: 'autoattendant', title: 'Big River | Auto Attendant' }
      },
      {
        path: 'callforwardingnoanswer',
        component: CallForwardingNoAnswerComponent,
        canActivate: [AuthGuard],
        data: { state: 'callforwardingnoanswer', title: 'Big River | Call Forwarding No Answer' }
      },
      {
        path: 'do-not-disturb',
        component: DoNotDisturbComponent,
        canActivate: [AuthGuard],
        data: { state: 'do-not-disturb', title: 'Big River | Do Not Disturb' }
      },
      {
        path: 'complex',
        component: ComplexComponent,
        canActivate: [AuthGuard],
        data: { state: 'complex', title: 'Big River | Complex' }
      },
      {
        path: 'all-call-forwarding',
        component: DoNotDisturbComponent,
        canActivate: [AuthGuard],
        data: { state: 'all-call-forwarding', title: 'Big River | All Call Forwarding' }
      },
      {
        path: 'branding-options',
        component: BrandingComponent,
        canActivate: [BrandingAdminGuard],
        data: { state: 'branding-options', title: 'Big River | Branding Options' }
      },
      {
        path: 'invoices',
        component: InvoicesComponent,
        data: { state: 'invoices', title: 'Big River | Invoices' }
      },
      {
        path: 'call-records',
        component: CallRecordsPageComponent,
        canActivate: [CallRecordsPageGuard],
        data: { state: 'call-records', title: 'Big River | Call Records' }
      },
      {
        path: 'one-time-payment',
        component: OneTimePaymentComponent,
        data: { state: 'one-time-payment', title: 'Big River | One-Time Payment' }
      },
      {
        path: 'autopay',
        component: AutopayComponent,
        data: { state: 'autopay', title: 'Big River | Autopay' }
      },
      {
        path: 'support',
        component: SupportTokenComponent,
        data: { state: 'support', title: 'Big River | Support' }
      },
      {
        path: 'hcsupport',
        component: HcSupportTokenComponent,
        data: { state: 'hcsupport', title: 'Big River | Hughes Consumer Support' }
      },
      {
        path: 'admin',
        canActivate: [AdminPermissionsGuard],
        children: [
          { 
            path: 'user-registration', 
            component: UserRegistrationComponent, 
            data: { title: 'Admin | User Registration' } 
          },
          { 
            path: 'user-admin', 
            component: UserAdminComponent, 
            data: { title: 'Admin | User Admin' } 
          }
        ]
      },
      { path: 'browser-unsupported', component: IncompatibleBrowserComponent}
]

const config: ExtraOptions = {
  useHash: true,
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

@NgModule({
  imports: [ RouterModule.forRoot(routes, config)],
  exports: [ RouterModule ],
  providers: []
})
export class AppRoutingModule {}
