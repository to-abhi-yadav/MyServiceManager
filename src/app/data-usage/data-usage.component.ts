import { Component, OnInit, AfterViewInit, ViewChild, Testability } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { DataUsageService } from './data-usage.service';
import { Chart } from 'chart.js'
import { DataUsage } from './data-usage'
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-data-usage',
  templateUrl: './data-usage.component.html',
  styleUrls: ['./data-usage.component.scss']
})
export class DataUsageComponent implements OnInit {
  component = 'DataUsageComponent'
  freeDataUsage: DataUsage[] = [];
  billedDataUsage: DataUsage[] = [];
  freeDataUsageNames = [];
  freeDataUsageData = [];
  billedDataUsageNames = [];
  billedDataUsageData = [];
  freeDataUsageTotal = 0;
  billedDataUsageTotal = 0;
  freeDataUsageOtherTotal = 0;
  billedDataUsageOtherTotal = 0;
  dataUsageMonths = [];
  monthDropdownValue = "0";
  chart: any;
  chart2: any;
  currentUser: User;
  msi = 0;
  dataCap = 1;
  startDate = "";
  endDate = "";
  isLoadingData = false;
  email = "";
  productName = "";
  cap = "";
  serviceLimit = "";
  totalDownload = "";
  totalUpload = "";
  isEnabled : Boolean = false;
  saving : Boolean = false;
  modalRef: NgbModalRef;
  closeResult = '';
  limit = "";

  toggleEnabledEmailNotification() {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled == false) {
      this.dataUsageService.setNotificationEmail(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        this.msi,
        this.email,
        this.isEnabled).subscribe((data) => {
          this.email = "";
        }, (error) => {

        })
    }
  }

  public openLg(content) {
    this.modalRef = this.modalService.open(content, {size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title'})
    this.modalRef.result.then((result) => {
      console.log(result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  setEmailNotification() {
    this.saving = true;
    this.dataUsageService.setNotificationEmail(
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      this.msi,
      this.email,
      this.isEnabled).subscribe((data) => {
        this.saving = false;
      }, (error) => {
        this.saving = false;
      })
  }
  
  async getDataUsage() {
    let res = await this.dataUsageService.retrieveDataUsage(this.currentUser.selectedTn.number, this.currentUser.accountId)
    const json = this.dataUsageService.parseXml(res)
    this.msi = json['Response']['DataUsage']['IMSI']['MSI']
    this.dataCap = json['Response']['DataUsage']['IMSI']['DataCap']
    this.productName = json['Response']['DataUsage']['IMSI']['ProductName']
    this.cap = json['Response']['DataUsage']['IMSI']['DataCap']
    if(this.cap == "None") {
      this.limit = "/ Unlimited"
    }
    else {
      this.limit = "/ " + this.cap + " GB"
    }
    this.serviceLimit = json['Response']['DataUsage']['IMSI']['ServiceLimit']
    this.totalDownload = json['Response']['DataUsage']['IMSI']['TotalDownload']
    this.totalUpload = json['Response']['DataUsage']['IMSI']['TotalUpload']
    this.email = json['Response']['DataUsage']['IMSI']['Email']
    if (this.email.length != 0) {
      this.isEnabled = true;
    }
    else {
      this.email = "";
    }
  }

  async getDetailDataUsage() {
    
    let res = await this.dataUsageService.retrieveDetailDataUsage(this.currentUser.selectedTn.number, this.currentUser.accountId, this.startDate, this.endDate, this.msi)
    const json = this.dataUsageService.parseXml(res)
    let freeTotal = Number(json['Response']['DetailedDataUsage']['UsageTypes'][0]['TotalUsage'])
    let billedTotal = Number(json['Response']['DetailedDataUsage']['UsageTypes'][1]['TotalUsage']) 
    let freeDataTopTotal = 0
    let billedDataTopTotal = 0
    //console.log(freeTotal)
    //Store free and billed services
    const freeUsageServices = json['Response']['DetailedDataUsage']['UsageTypes'][0]['Services']
    const billedUsageServices = json['Response']['DetailedDataUsage']['UsageTypes'][1]['Services'] 
    //console.log(json)
    //Map the name and usage to an array
    billedUsageServices['Service'].map(item => {
      this.billedDataUsage.push(new DataUsage(item["Name"],Number(item["Usage"]),Number(item["Usage"])/Number(billedTotal)))
      
    })
    freeUsageServices['Service'].map(item => {
      this.freeDataUsage.push(new DataUsage(item["Name"],Number(item["Usage"]), Number(item["Usage"])/Number(freeTotal)))

    })
    //Sort the Data By Usage
    this.freeDataUsage = this.freeDataUsage.sort(function(a,b){
      const af = a.data
      const bf = b.data
      if(af < bf) return 1
      if (af > bf) return -1
      return 0
    })
    this.billedDataUsage = this.billedDataUsage.sort(function(a,b){
      const af = a.data
      const bf = b.data
      if(af < bf) return 1
      if (af > bf) return -1
      return 0
    })

    //Slice the array to top 5
    this.freeDataUsage = this.freeDataUsage.slice(0, 5)
    this.billedDataUsage = this.billedDataUsage.slice(0,5)

    //Store label and datasets for chart
    this.freeDataUsage.map(item => {
      this.freeDataUsageNames.push(item.name)
    })
    this.freeDataUsage.map(item => {
      this.freeDataUsageData.push(item.data  / 1000000)
      freeDataTopTotal += item.data
    })
    this.billedDataUsage.map(item => {
      this.billedDataUsageNames.push(item.name)
    })
    this.billedDataUsage.map(item => {
      this.billedDataUsageData.push(item.data  / 1000000)
      billedDataTopTotal += item.data
    })

    //Calculate data usage of other services and add them to the arrays
    this.freeDataUsageOtherTotal = freeTotal - freeDataTopTotal
    this.billedDataUsageOtherTotal = billedTotal - billedDataTopTotal
    this.freeDataUsageTotal = freeTotal
    this.billedDataUsageTotal = billedTotal
    this.freeDataUsage.push(new DataUsage("Other", Number(this.freeDataUsageOtherTotal), Number(this.freeDataUsageOtherTotal)/freeTotal))
    this.billedDataUsage.push(new DataUsage("Other", Number(this.billedDataUsageOtherTotal),Number(this.billedDataUsageOtherTotal)/billedTotal))

    this.freeDataUsageNames.push('Other')
    this.freeDataUsageData.push(this.freeDataUsageOtherTotal / 1000000)
    this.billedDataUsageNames.push('Other')
    this.billedDataUsageData.push(this.billedDataUsageOtherTotal / 1000000)
    //console.log(this.billedDataUsageOtherTotal)
    //console.log(this.billedDataUsageNames)
    //console.log(this.billedDataUsageData)
    
  }

  async getDatesDetailUsage() {
    let res = await this.dataUsageService.retrieveDatesDetailUsage(this.currentUser.selectedTn.number, this.currentUser.accountId)
    const json = this.dataUsageService.parseXml(res)
    this.dataUsageMonths = json['Response']['DatesDetailUsage']['Months']
    this.dataUsageMonths = this.dataUsageMonths.sort(function(a,b){
      const af = Number(a["Month"])
      const bf = Number(b["Month"])
      if(af < bf) return -1
      if (af > bf) return 1
      return 0
    })
    this.startDate = json['Response']['DatesDetailUsage']['Months'][0]['StartDate']
    this.endDate = json['Response']['DatesDetailUsage']['Months'][0]['EndDate']
    //console.log(this.dataUsageMonths)
    //console.log(this.monthDropdownValue)
    //console.log(this.startDate + ' - ' + this.endDate)
  }

  async changeSelectedMonth() {
    this.isLoadingData = true
    this.chart.destroy()
    this.chart2.destroy()
    //Reset Values Needed for Chart Generation
    this.freeDataUsageOtherTotal = 0
    this.billedDataUsageOtherTotal = 0
    this.freeDataUsageTotal = 0
    this.billedDataUsageTotal = 0
    this.billedDataUsage = []
		this.freeDataUsage = []
		this.freeDataUsageNames = []
		this.freeDataUsageData = []
		this.billedDataUsageNames = []
		this.billedDataUsageData = [] 
    this.startDate = this.dataUsageMonths[Number(this.monthDropdownValue)].StartDate
    this.endDate = this.dataUsageMonths[Number(this.monthDropdownValue)].EndDate

    await this.getDetailDataUsage()
    this.isLoadingData = false
    this.createFreeUseChart()
    this.createBilledUseChart()
    
  }
  
  async createFreeUseChart() {
    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
          labels: this.freeDataUsageNames ,
          datasets: [{
              label: 'Free Data Usage',
              data: this.freeDataUsageData,
              backgroundColor: [
                  'rgba(75, 119, 190, 1)',
                  'rgba(103, 128, 159, 1)',
                  'rgba(171, 183, 183, 1)',
                  'rgba(218, 223, 225, 1)',
                  'rgba(108, 122, 137, 1)',
                  'rgba(238, 238, 238, 1)'
              ],
              borderColor: [
                  'rgba(75, 119, 190, 1)',
                  'rgba(103, 128, 159, 1)',
                  'rgba(171, 183, 183, 1)',
                  'rgba(218, 223, 225, 1)',
                  'rgba(108, 122, 137, 1)',
                  'rgba(238, 238, 238, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              //console.log(data)
              //console.log(tooltipItem.datasetIndex)
              var dataValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toFixed(2);
              var datasetLabel
              if(dataValue > 1000) {
                datasetLabel = (dataValue / 1000).toFixed(2).toString() + ' GB'
              }
              else {
                datasetLabel = dataValue.toString() + ' MB'
              }
              //var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toFixed(2);
              var label = data.labels[tooltipItem.index];
              return label + ': ' + datasetLabel;
            }
          }
        }
      }
  });
  }

  createBilledUseChart() {
    console.log(this.billedDataUsage);
    this.chart2 = new Chart('canvas2', {
      type: 'doughnut',
      data: {
          labels: this.billedDataUsageNames ,
          datasets: [{
              label: 'Billed Data Usage',
              data: this.billedDataUsageData,
              backgroundColor: [
                'rgba(75, 119, 190, 1)',
                'rgba(103, 128, 159, 1)',
                'rgba(171, 183, 183, 1)',
                'rgba(218, 223, 225, 1)',
                'rgba(108, 122, 137, 1)',
                'rgba(238, 238, 238, 1)'
              ],
              borderColor: [
                'rgba(75, 119, 190, 1)',
                'rgba(103, 128, 159, 1)',
                'rgba(171, 183, 183, 1)',
                'rgba(218, 223, 225, 1)',
                'rgba(108, 122, 137, 1)',
                'rgba(238, 238, 238, 1)'
              ],
              borderWidth: 1,
          }]
      },
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              //console.log(data)
              //console.log(tooltipItem.datasetIndex)
              var dataValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toFixed(2);
              var datasetLabel
              if(dataValue > 1000) {
                datasetLabel = (dataValue / 1000).toFixed(2).toString() + ' GB'
              }
              else {
                datasetLabel = dataValue.toString() + ' MB'
              }
              //var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toFixed(2);
              var label = data.labels[tooltipItem.index];
              return label + ': ' + datasetLabel;
            }
          }
        }
      }
  });

  }

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private dataUsageService: DataUsageService
  ) { 
    this.userService.currentUser.subscribe((user) => this.currentUser = user)
  }

  async ngOnInit() {
    this.isLoadingData = true
    //console.log(this.currentUser)
    await this.getDataUsage()
    await this.getDatesDetailUsage()
    await this.getDetailDataUsage()
    await this.createFreeUseChart()
    await this.createBilledUseChart()
    this.isLoadingData = false
  }

  

  ngAfterViewInit() {
    
  }
  

}
