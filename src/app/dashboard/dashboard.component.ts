import {
  Component,
  OnInit,
  ViewChild,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { User } from "../users/user";
import { UserService } from "../users/user.service";
import { DashboardService } from "./dashboard.service";
import { DomPortalHost, Portal, ComponentPortal } from "@angular/cdk/portal";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { VoicemailComponent } from "../voicemail/voicemail.component";
import { FeatureTypes } from "./feature-types.enum";
import { ComponentTypes } from "./component-types.enum";
import { HeaderComponent } from "../header/header.component";
import { AllCallForwardingComponent } from "../all-call-forwarding/all-call-forwarding.component";
import { CallForwardingBusyComponent } from "../call-forwarding-busy/call-forwarding-busy.component";
import { FindMeFollowMeComponent } from "../find-me-follow-me/find-me-follow-me.component";
import { SelectiveCallAcceptanceComponent } from "../selective-call-acceptance/selective-call-acceptance.component";
import { SelectiveCallRejectionComponent } from "../selective-call-rejection/selective-call-rejection.component";
import { SpeedDialingComponent } from "../speed-dialing/speed-dialing.component";
import { UnavailableCallForwardingComponent } from "../unavailable-call-forwarding/unavailable-call-forwarding.component";
import { CallRecordsComponent } from "../call-records/call-records.component";
import { AnonymousCallRejectionComponent } from "../anonymous-call-rejection/anonymous-call-rejection.component";
import { DataUsageComponent } from '../data-usage/data-usage.component';
import { BillingManagementComponent } from '../billing-management/billing-management.component';
import { $ } from "protractor";
import { InternationalminutesComponent } from "../internationalminutes/internationalminutes.component";
import { LocalStorageService } from "../shared/services/local-storage.service";
import { SimRingComponent } from "../sim-ring/sim-ring.component";
import { HuntingComponent } from "../hunting/hunting.component";
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";
import { AutoAttendantComponent } from '../auto-attendant/auto-attendant.component'
import { PortalHost } from './portal-host'
import { DoNotDisturbComponent } from '../do-not-disturb/do-not-disturb.component';
import { ComplexComponent } from '../complex/complex.component';
import { CallForwardingNoAnswerComponent } from '../call-forwarding-no-answer/call-forwarding-no-answer.component';
import {} from '../internationalminutes/internationalminutes.component';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public subscribers: any = {};
  currentUser: User;
  isLoadingComponents = true
  @ViewChild("servicesDrop") servicesDrop
  portal: ComponentPortal<any>;
  portalHost: DomPortalHost;
  services = []
  featureTypes;
  componentTypes;
  tnActiveComponents = []
  componentList = []
  availableComponents = []
  portalHosts: PortalHost[] = []
  lastComponentRemoved: number
  componentRemoved: boolean
  tnAvailableComponents = []
  featureComponents = []

  totalNumberOfTileBoxes: number = 20;
  lastTileBoxInitialized: number = 0;
  tileBox0Showing: boolean = true;
  tileBox1Showing: boolean = true;
  tileBox2Showing: boolean = true;
  tileBox3Showing: boolean = true;
  tileBox4Showing: boolean = true;
  tileBox5Showing: boolean = true;
  tileBox6Showing: boolean = true;
  tileBox7Showing: boolean = true;
  tileBox8Showing: boolean = true;
  tileBox9Showing: boolean = true;
  tileBox10Showing: boolean = true;
  tileBox11Showing: boolean = true;
  tileBox12Showing: boolean = true;
  tileBox13Showing: boolean = true;
  tileBox14Showing: boolean = true;
  tileBox15Showing: boolean = true;
  tileBox16Showing: boolean = true;
  tileBox17Showing: boolean = true;
  tileBox18Showing: boolean = true;
  tileBox19Showing: boolean = true;

  noComponents: boolean
  
  subs = new Subscription();
  bag = 'services-list'

  portalIndex: number

  constructor(
    private userService: UserService,
    private dashService: DashboardService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private cd: ChangeDetectorRef,
    private storage: LocalStorageService,
    private dragNDropService: DragulaService
  ) {
    this.currentUser = this.userService.currentUserValue
    this.subs.add(this.dragNDropService.dropModel("services-list").subscribe(({ sourceModel, targetModel, item, name, el, target, source, sibling })=> {
      this.tnActiveComponents = sourceModel
      this.updateSequence()
    }))
    this.subs.add(this.dragNDropService.drag("services-list").subscribe(({ name, el, source })=> {
      let classToRemove = el.classList[1]
      classToRemove = ''
    }))
  }

  ngOnInit() {
    this.featureTypes = FeatureTypes
    this.componentTypes = ComponentTypes
    this.isLoadingComponents = true
    this.subscribeToSelectedTn()
    this.subscribeToComponentChanges()
  }

  ngAfterViewInit() {
    // this.subscribeToComponentChanges()
  }

  ngOnDestroy() {
    this.subscribers.tn.unsubscribe()
    this.subs.unsubscribe()
  }

  subscribeToSelectedTn() {
    this.subscribers.tn = this.userService.selectedTn.subscribe(tn => {
      this.isLoadingComponents = true
      this.services = []
      this.services.length = 0
      this.tnAvailableComponents = []
      this.tnAvailableComponents.length = 0
      if (this.currentUser.selectedTn.number !== tn.number) {
        this.currentUser.selectedTn.number = tn.number
        tn.features.forEach( feature => this.tnAvailableComponents.push(feature))
        this.removeAllPortalHosts()
        this.getMenu()
      } else {
        this.removeAllPortalHosts()
        tn.features.forEach( feature => this.tnAvailableComponents.push(feature))
        this.getMenu()
      }
    })
  }

  subscribeToComponentChanges() {
    this.dashService.componentToHideValue.subscribe( component => {
      if (component !== undefined) {
        this.removeComponentFromDashboard(component)
      }
    })
  }

  getMenu() {
    this.currentUser.selectedTn.features.forEach( feature =>
      this.services.push(feature) )
      this.buildTheComponents()
  }

  updateSequence(){
    // return enum based on component for updating sequence
    const sequence = []
    console.log(this.tnActiveComponents)
    // build the array of enums
    this.tnActiveComponents.forEach(comp => {
      const compEnum = this.componentTypes[comp];
      if (compEnum !== undefined) {
        sequence.push(compEnum);
      }
    })
    // update the component sequence
    this.dashService.setComponentSequence(
      this.currentUser.token, this.currentUser.selectedTn.number, this.currentUser.accountId, sequence)
      .subscribe(data => {
        let datum = this.dashService.parseXml(data);
    })
  }

  buildTheComponents() {
    const compNames = [];
    // Determines which components are available on the currently selected TN to be initialized
    this.services.forEach((service, i) => {
      const comp = this.componentTypes[this.featureTypes[service]];
      if (comp !== undefined) {
        compNames.push(comp);
      }
    });
    this.hideUnusedTileBoxes(this.lastTileBoxInitialized)
    // grab the current user again for the sequence
    this.currentUser = this.userService.currentUserValue
    let myComponentSequence = []
    // Get the user's component sequence
    this.dashService.getComponentSequence(this.currentUser.token, this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe( res => 
      {
        const parsed = this.dashService.parseXml(res)
        if (parsed['Response']['Status']['Code'] === '200') {
          myComponentSequence = parsed['Response']['ComponentSequence'].replace(/\[/g, "").replace(/\]/g, "").split(",");
        } else {
          myComponentSequence = this.currentUser.componentSequence.replace(/\[/g, "").replace(/\]/g, "").split(",");
        }
        const featureComponentsToInitialize = []
        if (myComponentSequence.length === 0) { this.noComponents = true }
        // Map the user's component sequence to components to be initialized
        myComponentSequence.map((element, index) => {
          let obj = this.componentTypes[element]
          if(typeof obj !== undefined) {
            // Check and only initialize IFF the user has that feature available to their TN
            if (compNames.includes(obj)){
              featureComponentsToInitialize.push(obj);
            } else {
              // User does not have that feature available on this TN
              this.isLoadingComponents = false
            }
          }
        })
        // Create the portals
        let portal: ComponentPortal<any>;
        this.availableComponents = compNames;
        featureComponentsToInitialize.forEach((comp, i) => {
          if (comp) {
            // Keep track of the tn active components list
            this.tnActiveComponents.push(comp)
            // Create a portalHost from a DOM element
            this.portalHost = new DomPortalHost(
              document.querySelector("#tile-box-" + (i)),
              this.componentFactoryResolver,
              this.appRef,
              this.injector
            );
            // when changing the tn we need to grab the tilebox and remove the old component class name
            let classToRemove = document.querySelector("#tile-box-" + (i)).classList[1]
            document.querySelector("#tile-box-" + (i)).classList.remove(classToRemove.toLowerCase())
            // assign the component being injected class name
            document.querySelector("#tile-box-" + (i)).classList.add(comp.toLowerCase())
            // Resolve the component
            const component = this.resolveTheComponent(comp);
            // Create the portal with the correct component
            portal = new ComponentPortal(component);
            // Attach the portal to the host
            this.portalHost.attach(portal);
            // add the portal host to the array
            const newPortalHost = new PortalHost({name: comp, domPortalHost: this.portalHost, tilebox: i})
            this.portalHosts.push(newPortalHost)

            console.log('Portal Hosts in Build = ', this.portalHosts)
            this.lastTileBoxInitialized = i;
            this.showHiddenTileBox(this.lastTileBoxInitialized)
          }
        });
        this.compareActiveComponentsToAvailableComponents(this.tnActiveComponents, this.availableComponents)
        // stop the spinner
        this.isLoadingComponents = false
        this.cd.markForCheck()
        console.log(this.tnActiveComponents)
      }
    )
    
  }

  // This is triggered when you click on a component from the Add Service dropdown
  addServiceToDashboard(component) {
    this.isLoadingComponents = true
    this.noComponents = false
    // define the component portal
    let portal: ComponentPortal<any>
    if (this.portalHosts.length === 0){
      // render the portal
      const i = 0
      this.portalIndex = i
      console.log(this.portalIndex)
      // show the first available tile box
      this.showHiddenTileBox(i)
      // set the last tilebox initialized to the tnActiveComponents.length
      this.lastTileBoxInitialized = this.tnActiveComponents.length
      // Create a portalHost from the first available DOM element
      this.portalHost = new DomPortalHost(
        document.querySelector("#tile-box-" + (i)),
        this.componentFactoryResolver,
        this.appRef,
        this.injector
      )
      // when changing the tn we need to grab the tilebox and remove the old component class name
      let classToRemove = document.querySelector("#tile-box-" + (i)).classList[1]
      document.querySelector("#tile-box-" + (i)).classList.remove(classToRemove.toLowerCase())
      document.querySelector("#tile-box-" + (i)).classList.add(component.toLowerCase())
    } else if (this.lastComponentRemoved) {
      // find the first available tile box that is not shown
      const i = this.returnFirstAvailableTileBox()
      this.portalIndex = i
      this.showHiddenTileBox(i)
      this.lastTileBoxInitialized = this.tnActiveComponents.length+1
      this.portalHost = new DomPortalHost(
        document.querySelector("#tile-box-" + (i)),
        this.componentFactoryResolver,
        this.appRef,
        this.injector
      );
      // when changing the tn we need to grab the tilebox and remove the old component class name
      let classToRemove = document.querySelector("#tile-box-" + (i)).classList[1]
      document.querySelector("#tile-box-" + (i)).classList.remove(classToRemove.toLowerCase())
      document.querySelector("#tile-box-" + (i)).classList.add(component.toLowerCase())
      this.lastComponentRemoved = null
      this.cd.markForCheck()
    } else if (this.componentRemoved) {
        // find the first available tile box that is not shown
        const i = this.returnFirstAvailableTileBox()
        this.portalIndex = i
        console.log(this.portalIndex)
        // show the first available tile box
        this.showHiddenTileBox(i)
        // set the last tilebox initialized to the tnActiveComponents.length
        this.lastTileBoxInitialized = this.tnActiveComponents.length
        // Create a portalHost from the first available DOM element
        this.portalHost = new DomPortalHost(
          document.querySelector("#tile-box-" + (i)),
          this.componentFactoryResolver,
          this.appRef,
          this.injector
        )
        // when changing the tn we need to grab the tilebox and remove the old component class name
        let classToRemove = document.querySelector("#tile-box-" + (i)).classList[1]
        document.querySelector("#tile-box-" + (i)).classList.remove(classToRemove.toLowerCase())
        document.querySelector("#tile-box-" + (i)).classList.add(component.toLowerCase())
    } else {
      // find the first available tile box that is not shown
      const i = this.returnFirstAvailableTileBox()
      this.portalIndex = i
      console.log(this.portalIndex)
      // show the first available tile box
      this.showHiddenTileBox(i)
      // set the last tilebox initialized to the tnActiveComponents.length
      this.lastTileBoxInitialized = this.tnActiveComponents.length
      // Create a portalHost from the first available DOM element
      this.portalHost = new DomPortalHost(
        document.querySelector("#tile-box-" + (i)),
        this.componentFactoryResolver,
        this.appRef,
        this.injector
      )
      // when changing the tn we need to grab the tilebox and remove the old component class name
      let classToRemove = document.querySelector("#tile-box-" + (i)).classList[1]
      document.querySelector("#tile-box-" + (i)).classList.remove(classToRemove.toLowerCase())
      document.querySelector("#tile-box-" + (i)).classList.add(component.toLowerCase())
    }

    
    // Resolve the component
    const comp = this.resolveTheComponent(component)
    // Create the portal with the correct component
    portal = new ComponentPortal(comp);
    // Attach the portal to the host
    this.portalHost.attach(portal);
    // add the portal host to the array
    const newPortal = new PortalHost({name: component, domPortalHost: this.portalHost, tilebox: this.portalIndex})
    this.portalIndex = null
    this.portalHosts.push(newPortal)
    // add the new component to the array
    this.tnActiveComponents.push(component)
    // Remove new component from the dropdown menu
    this.compareActiveComponentsToAvailableComponentsAndRemove(this.tnActiveComponents, this.availableComponents)
    // set the new component sequence
    this.updateSequence()
    // stop spinner
    this.isLoadingComponents = false
    this.cd.markForCheck()
  }

  // VIEW RELATED TODO: Change To A Pipe 
  resolveComponentName(comp) {
    let serviceName;
    switch (comp) {
      case "AllCallForwardingComponent":
        serviceName = 'All Call Forwarding';
        break;
      case "CallForwardingBusyComponent":
        serviceName = 'Call Forwarding Busy';
        break;
      case "SelectiveCallAcceptanceComponent":
        serviceName = 'Selective Call Acceptance';
        break;
      case "SelectiveCallRejectionComponent":
        serviceName = 'Selective Call Rejection';
        break;
      case "FindMeFollowMeComponent":
        serviceName = 'Find Me Follow Me';
        break;
      case "SpeedDialingComponent":
        serviceName = 'Speed Dialing';
        break;
      case "UnavailableCallForwardingComponent":
        serviceName = 'Unavailable Call Forwarding';
        break;
      case "VoicemailComponent":
        serviceName = 'Voicemail';
        break;
      case "CallRecordsComponent":
        serviceName = 'Call Records';
        break;
      case "AnonymousCallRejectionComponent":
        serviceName = 'Anonymous Call Rejection';
        break;
      case "InternationalminutesComponent":
        serviceName = 'International Minutes';
        break;
      case "DataUsageComponent":
        serviceName = 'Data Usage';
        break;
      case "BillingManagementComponent":
        serviceName = 'Billing Management';
        break;
      case "SimRingComponent":
        serviceName = 'Sim Ring';
        break;
      case "HuntingComponent":
        serviceName = 'Hunting';
        break;
      case "AutoAttendantComponent":
        serviceName = 'Auto Attendant';
        break;
      case "DoNotDisturbComponent":
        serviceName = 'Do Not Disturb';
        break;
      case "InternationalminutesComponent":
        serviceName = 'International Minutes';
        break;
      case "CallForwardingNoAnswerComponent":
        serviceName = 'Call Forwarding No Answer';
        break;
      case "ComplexComponent":
        serviceName = 'Complex';
        break;
      default: 
        serviceName = null
        break;
    }
    return serviceName;
  }

  resolveTheName(comp) {
    let component;
    switch (comp) {
      case AllCallForwardingComponent:
        component = 'AllCallForwardingComponent';
        break;
      case CallForwardingBusyComponent:
        component = 'CallForwardingBusyComponent';
        break;
      case SelectiveCallAcceptanceComponent:
        component = 'SelectiveCallAcceptanceComponent';
        break;
      case SelectiveCallRejectionComponent:
        component = 'SelectiveCallRejectionComponent';
        break;
      case FindMeFollowMeComponent:
        component = 'FindMeFollowMeComponent';
        break;
      case SpeedDialingComponent:
        component = 'SpeedDialingComponent';
        break;
      case DataUsageComponent:
        component = 'DataUsageComponent';
        break;
      case UnavailableCallForwardingComponent:
        component = 'UnavailableCallForwardingComponent';
        break;
      case VoicemailComponent:
        component = 'VoicemailComponent';
        break;
      case CallRecordsComponent:
        component = 'CallRecordsComponent';
        break;
      case AnonymousCallRejectionComponent:
        component = 'AnonymousCallRejectionComponent';
        break;
      case InternationalminutesComponent:
        component = 'InternationalminutesComponent';
        break;
      case SimRingComponent:
        component = 'SimRingComponent';
        break;
      case HuntingComponent:
        component = 'HuntingComponent';
        break;
      case AutoAttendantComponent:
        component = 'AutoAttendantComponent';
        break;
      case DoNotDisturbComponent:
        component = 'DoNotDisturbComponent';
        break;
      case ComplexComponent:
        component = 'ComplexComponent';
        break;
      case InternationalminutesComponent:
        component = 'InternationalminutesComponent';
        break;
      case BillingManagementComponent:
        component = 'BillingManagementComponent';
        break;
      default: 
        component = null
        break;
    }
    return component;
  }
 removeComponentNameClasses() {
    const els = document.querySelectorAll('.tile-box')
    for (var i = 0; i < els.length; i++) {
      let classToRemove = els[i].classList[1]
      classToRemove = ''
    }
    this.cd.markForCheck()
  }

  private removeAllPortalHosts() {
    if (this.tnActiveComponents && this.tnActiveComponents.length > 0) {
      this.portalHosts.forEach(portalHost => {
        // detach the portal hosts
        portalHost.domPortalHost.detach()
        // for each component that is active hide the tilebox
        this.tnActiveComponents.forEach((obj, i) => {
          this.hideAllTileBoxes(i)
          this.lastTileBoxInitialized = 0
        })
        // now remove from active component array
        this.tnActiveComponents = []
      })
      this.portalHosts = []
      this.portalHosts.length = 0
      console.log('portal hosts in remove all portal hosts', this.portalHosts)
    }
  }

  private removeComponentFromDashboard(component) {
    console.log('Component to Remove = ', component)
    // grab the component
    const comp = this.resolveTheComponent(component)
    // find the component portal post
    console.log('Portal Hosts = ', this.portalHosts)
    const indPortal = this.portalHosts.filter(obj => { 
      if (obj.name === component) {
        return obj.domPortalHost
      } else {
        return undefined
      }
    });

    console.log('Portal Object = ', indPortal)
    // check the portal
    if (indPortal) {
      const portal = indPortal[0]
      if (portal) {
        console.log('Portal Obj Drilled Down = ', portal)
      // grab the tile box to hide
      const tileBoxToHide = portal.tilebox
      console.log('Tile Box To Hide = ', tileBoxToHide)
      // convert to int
      const tileBoxNumber = +tileBoxToHide
      console.log(tileBoxNumber)
      // hide the tilebox
      this.hideSpecificTileBox(tileBoxNumber)
      // detach the portal
      portal.domPortalHost.detach()
      // remove the component from the tnActiveCompnents array
      this.tnActiveComponents = this.tnActiveComponents.filter(obj => obj !== component)
      // add the component back to the component list
      this.componentList.push(component)
      // subtract from the index
      this.lastTileBoxInitialized = this.lastTileBoxInitialized-1;
      // mark the view for check
      this.lastComponentRemoved = tileBoxNumber
      // set the value of component true to removed
      this.componentRemoved = true


      this.portalHosts = this.portalHosts.filter(obj => obj.name !== component)

      console.log('Portal Hosts after removal filter = ', this.portalHosts)
      this.cd.markForCheck()
      } else {
        console.log('>>>>>>>>>>>>> Could not find the portal!!!!')
      }
      
    } else {
      console.log('>>>>>>>>>>>>> Could not find the portal!!!!')
    }
    this.updateSequence()
  }

  private compareActiveComponentsToAvailableComponents(arr1, arr2) {
    let finalArray = []
    finalArray = arr2.filter(item => arr1.indexOf(item) < 0)
    this.componentList = []
    finalArray.forEach(obj => {
      if (obj !== undefined) {
        this.componentList.push(obj)
      }
    })
    // console.log(this.componentList)
  }
  // This is triggered to re-calculate the available components not initialize on the dashboard for the Add Services dropdown options
  private compareActiveComponentsToAvailableComponentsAndRemove(arr1, arr2) {
    let finalArray = []
    finalArray = arr2.filter(item => arr1.indexOf(item) < 0)
    this.componentList = finalArray
  }

  private resolveTheComponent(comp) {
    let component;
    switch (comp) {
      case "AllCallForwardingComponent":
        component = AllCallForwardingComponent;
        break;
      case "CallForwardingBusyComponent":
        component = CallForwardingBusyComponent;
        break;
      case "SelectiveCallAcceptanceComponent":
        component = SelectiveCallAcceptanceComponent;
        break;
      case "SelectiveCallRejectionComponent":
        component = SelectiveCallRejectionComponent;
        break;
      case "FindMeFollowMeComponent":
        component = FindMeFollowMeComponent;
        break;
      case "SpeedDialingComponent":
        component = SpeedDialingComponent;
        break;
      case "UnavailableCallForwardingComponent":
        component = UnavailableCallForwardingComponent;
        break;
      case "VoicemailComponent":
        component = VoicemailComponent;
        break;
      case "CallRecordsComponent":
        component = CallRecordsComponent;
        break;
      case "InternationalmintuesComponent":
        component = InternationalminutesComponent;
        break;
      case "AnonymousCallRejectionComponent":
        component = AnonymousCallRejectionComponent;
        break;
      case "DataUsageComponent":
        component = DataUsageComponent;
        break;
      case "SimRingComponent":
        component = SimRingComponent;
        break;
      case "HuntingComponent":
        component = HuntingComponent;
        break;
      case "BillingManagementComponent":
        component = BillingManagementComponent;  
        break;
      case "AutoAttendantComponent":
        component = AutoAttendantComponent;
        break;
      case "DoNotDisturbComponent":
        component = DoNotDisturbComponent;
        break;
      case "InternationalminutesComponent":
        component = InternationalminutesComponent;
        break;
      case "CallForwardingNoAnswerComponent":
        component = CallForwardingNoAnswerComponent;
        break;
      case "ComplexComponent":
        component = ComplexComponent;
        break;
      default: 
        component = null
        break;
    }
    return component;
  }

  returnTileBox(i) {
    if (i === 0 && this.tileBox0Showing) {
      return false
    } else if (i === 1 && this.tileBox1Showing) {
      return false
    } else if (i === 2 && this.tileBox2Showing) {
      return false
    } else if (i === 3 && this.tileBox3Showing) {
      return false
    } else if (i === 4 && this.tileBox4Showing) {
      return false
    } else if (i === 5 && this.tileBox5Showing) {
      return false
    } else if (i === 6 && this.tileBox6Showing) {
      return false
    } else if (i === 7 && this.tileBox7Showing) {
      return false
    } else if (i === 8 && this.tileBox8Showing) {
      return false
    } else if (i === 9 && this.tileBox9Showing) {
      return false
    } else if (i === 10 && this.tileBox10Showing) {
      return false
    } else if (i === 11 && this.tileBox11Showing) {
      return false
    } else if (i === 12 && this.tileBox12Showing) {
      return false
    } else if (i === 13 && this.tileBox13Showing) {
      return false
    } else if (i === 14 && this.tileBox14Showing) {
      return false
    } else if (i === 15 && this.tileBox15Showing) {
      return false
    } else if (i === 16 && this.tileBox16Showing) {
      return false
    } else if (i === 17 && this.tileBox17Showing) {
      return false
    } else if (i === 18 && this.tileBox18Showing) {
      return false
    } else if (i === 19 && this.tileBox19Showing) {
      return false
    } else {
      return true
    }
  }

  private returnFirstAvailableTileBox() {
    if (this.tileBox0Showing === false) {
      return 0
    } else if (this.tileBox1Showing === false) {
      return 1
    } else if (this.tileBox2Showing === false) {
      return 2
    } else if (this.tileBox3Showing === false) {
      return 3
    } else if (this.tileBox4Showing === false) {
      return 4
    } else if (this.tileBox5Showing === false) {
      return 5
    } else if (this.tileBox6Showing === false) {
      return 6
    } else if (this.tileBox7Showing === false) {
      return 7
    } else if (this.tileBox8Showing === false) {
      return 8
    } else if (this.tileBox9Showing === false) {
      return 9
    } else if (this.tileBox10Showing === false) {
      return 10
    } else if (this.tileBox11Showing === false) {
      return 11
    } else if (this.tileBox12Showing === false) {
      return 12
    } else if (this.tileBox13Showing === false) {
      return 13
    } else if (this.tileBox14Showing === false) {
      return 14
    } else if (this.tileBox15Showing === false) {
      return 15
    } else if (this.tileBox16Showing === false) {
      return 16
    } else if (this.tileBox17Showing === false) {
      return 17
    } else if (this.tileBox18Showing === false) {
      return 18
    } else if (this.tileBox19Showing === false) {
      return 19
    } else {
      return 20
    }
  }

  private hideSpecificTileBox(tileBox: number) {
    switch(tileBox) { 
      case 0: { 
        this.tileBox0Showing = false;
        break; 
      } 
      case 1: { 
        this.tileBox1Showing = false;
        break; 
      } 
      case 2: { 
        this.tileBox2Showing = false;
        break; 
      }
      case 3: { 
        this.tileBox3Showing = false;
        break; 
      }
      case 4: { 
        this.tileBox4Showing = false;
        break; 
      }
      case 5: { 
        this.tileBox5Showing = false;
        break; 
      }
      case 6: { 
        //statements; 
        this.tileBox6Showing = false;
        break; 
      }
      case 7: { 
        //statements; 
        this.tileBox7Showing = false;
        break; 
      }
      case 8: { 
        //statements; 
        this.tileBox8Showing = false;
        break; 
      }
      case 9: { 
        //statements; 
        this.tileBox9Showing = false;
        break; 
      }
      case 10: { 
        //statements; 
        this.tileBox10Showing = false;
        break; 
      }
      case 11: { 
        //statements; 
        this.tileBox11Showing = false;
        break; 
      }
      case 12: { 
        //statements; 
        this.tileBox12Showing = false;
        break; 
      }
      case 13: { 
        //statements; 
        this.tileBox13Showing = false;
        break; 
      }
      case 14: { 
        //statements; 
        this.tileBox14Showing = false;
        break; 
      }
      case 15: { 
        //statements; 
        this.tileBox15Showing = false;
        break; 
      }
      case 16: { 
        //statements; 
        this.tileBox16Showing = false;
        break; 
      }
      case 17: { 
        //statements; 
        this.tileBox17Showing = false;
        break; 
      }
      case 18: { 
        //statements; 
        this.tileBox18Showing = false;
        break; 
      }
      case 19: { 
        //statements; 
        this.tileBox19Showing = false;
        break; 
      }
      default: { 
        //statements; 
        break; 
      } 
    }
  }

  private hideUnusedTileBoxes(lastTileBoxNumberInitialized: number){
    for (let index = lastTileBoxNumberInitialized+1; index <= this.totalNumberOfTileBoxes; index++) {
      switch(index) { 
        case 0: { 
          this.tileBox0Showing = false;
          break; 
        } 
        case 1: { 
          this.tileBox1Showing = false;
          break; 
        } 
        case 2: { 
          this.tileBox2Showing = false;
          break; 
        }
        case 3: { 
          this.tileBox3Showing = false;
          break; 
        }
        case 4: { 
          this.tileBox4Showing = false;
          break; 
        }
        case 5: { 
          this.tileBox5Showing = false;
          break; 
        }
        case 6: { 
          //statements; 
          this.tileBox6Showing = false;
          break; 
        }
        case 7: { 
          //statements; 
          this.tileBox7Showing = false;
          break; 
        }
        case 8: { 
          //statements; 
          this.tileBox8Showing = false;
          break; 
        }
        case 9: { 
          //statements; 
          this.tileBox9Showing = false;
          break; 
        }
        case 10: { 
          //statements; 
          this.tileBox10Showing = false;
          break; 
        }
        case 11: { 
          //statements; 
          this.tileBox11Showing = false;
          break; 
        }
        case 12: { 
          //statements; 
          this.tileBox12Showing = false;
          break; 
        }
        case 13: { 
          //statements; 
          this.tileBox13Showing = false;
          break; 
        }
        case 14: { 
          //statements; 
          this.tileBox14Showing = false;
          break; 
        }
        case 15: { 
          //statements; 
          this.tileBox15Showing = false;
          break; 
        }
        default: { 
          //statements; 
          break; 
        } 
      }  
    } 
  }

  private showTileBoxes(lastTileBoxNumberInitialized: number){
    for (let index = lastTileBoxNumberInitialized+1; index <= 1; index--) {
      switch(index) { 
        case 0: { 
          this.tileBox0Showing = true;
          break; 
        } 
        case 1: { 
          this.tileBox1Showing = true;
          break; 
        } 
        case 2: { 
          this.tileBox2Showing = true;
          break; 
        }
        case 3: { 
          this.tileBox3Showing = true;
          break; 
        }
        case 4: { 
          this.tileBox4Showing = true;
          break; 
        }
        case 5: { 
          this.tileBox5Showing = true;
          break; 
        }
        case 6: { 
          //statements; 
          this.tileBox6Showing = true;
          break; 
        }
        case 7: { 
          //statements; 
          this.tileBox7Showing = true;
          break; 
        }
        case 8: { 
          //statements; 
          this.tileBox8Showing = true;
          break; 
        }
        case 9: { 
          //statements; 
          this.tileBox9Showing = true;
          break; 
        }
        case 10: { 
          //statements; 
          this.tileBox10Showing = true;
          break; 
        }
        case 11: { 
          //statements; 
          this.tileBox11Showing = true;
          break; 
        }
        case 12: { 
          //statements; 
          this.tileBox12Showing = true;
          break; 
        }
        case 13: { 
          //statements; 
          this.tileBox13Showing = true;
          break; 
        }
        case 14: { 
          //statements; 
          this.tileBox14Showing = true;
          break; 
        }
        case 15: { 
          //statements; 
          this.tileBox15Showing = true;
          break; 
        }
        case 16: { 
          //statements; 
          this.tileBox16Showing = true;
          break; 
        }
        case 17: { 
          //statements; 
          this.tileBox17Showing = true;
          break; 
        }
        case 18: { 
          //statements; 
          this.tileBox18Showing = true;
          break; 
        }
        case 19: { 
          //statements; 
          this.tileBox19Showing = true;
          break; 
        }
        default: { 
          //statements; 
          break; 
        } 
      }
    } 
  }

  private showHiddenTileBox(TileBoxNumber: number){
      switch(TileBoxNumber) { 
        case 0: { 
          this.tileBox0Showing = true;
          break; 
        } 
        case 1: { 
          this.tileBox1Showing = true;
          break; 
        } 
        case 2: { 
          this.tileBox2Showing = true;
          break; 
        }
        case 3: { 
          this.tileBox3Showing = true;
          break; 
        }
        case 4: { 
          this.tileBox4Showing = true;
          break; 
        }
        case 5: { 
          this.tileBox5Showing = true;
          break; 
        }
        case 6: { 
          //statements; 
          this.tileBox6Showing = true;
          break; 
        }
        case 7: { 
          //statements; 
          this.tileBox7Showing = true;
          break; 
        }
        case 8: { 
          //statements; 
          this.tileBox8Showing = true;
          break; 
        }
        case 9: { 
          //statements; 
          this.tileBox9Showing = true;
          break; 
        }
        case 10: { 
          //statements; 
          this.tileBox10Showing = true;
          break; 
        }
        case 11: { 
          //statements; 
          this.tileBox11Showing = true;
          break; 
        }
        case 12: { 
          //statements; 
          this.tileBox12Showing = true;
          break; 
        }
        case 13: { 
          //statements; 
          this.tileBox13Showing = true;
          break; 
        }
        case 14: { 
          //statements; 
          this.tileBox14Showing = true;
          break; 
        }
        case 15: { 
          //statements; 
          this.tileBox15Showing = true;
          break; 
        }
        case 16: { 
          //statements; 
          this.tileBox16Showing = true;
          break; 
        }
        case 17: { 
          //statements; 
          this.tileBox17Showing = true;
          break; 
        }
        case 18: { 
          //statements; 
          this.tileBox18Showing = true;
          break; 
        }
        case 19: { 
          //statements; 
          this.tileBox19Showing = true;
          break; 
        }
        default: { 
          //statements; 
          break; 
        } 
      }
  }

  private hideAllTileBoxes(TileBoxNumber: number) {
    switch(TileBoxNumber) { 
      case 1: { 
        this.tileBox1Showing = false;
        break; 
      } 
      case 2: { 
        this.tileBox2Showing = false;
        break; 
      }
      case 3: { 
        this.tileBox3Showing = false;
        break; 
      }
      case 4: { 
        this.tileBox4Showing = false;
        break; 
      }
      case 5: { 
        this.tileBox5Showing = false;
        break; 
      }
      case 6: { 
        //statements; 
        this.tileBox6Showing = false;
        break; 
      }
      case 7: { 
        //statements; 
        this.tileBox7Showing = false;
        break; 
      }
      case 8: { 
        //statements; 
        this.tileBox8Showing = false;
        break; 
      }
      case 9: { 
        //statements; 
        this.tileBox9Showing = false;
        break; 
      }
      case 10: { 
        //statements; 
        this.tileBox10Showing = false;
        break; 
      }
      case 11: { 
        //statements; 
        this.tileBox11Showing = false;
        break; 
      }
      case 12: { 
        //statements; 
        this.tileBox12Showing = false;
        break; 
      }
      case 13: { 
        //statements; 
        this.tileBox13Showing = false;
        break; 
      }
      case 14: { 
        //statements; 
        this.tileBox14Showing = false;
        break; 
      }
      case 15: { 
        //statements; 
        this.tileBox15Showing = false;
        break; 
      }
      case 16: { 
        //statements; 
        this.tileBox16Showing = false;
        break; 
      }
      case 17: { 
        //statements; 
        this.tileBox17Showing = false;
        break; 
      }
      case 18: { 
        //statements; 
        this.tileBox18Showing = false;
        break; 
      }
      case 19: { 
        //statements; 
        this.tileBox19Showing = false;
        break; 
      }
      default: { 
        //statements; 
        break; 
      } 
    }
  }

}
