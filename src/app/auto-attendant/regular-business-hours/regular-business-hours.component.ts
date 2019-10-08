import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Keyboard from "simple-keyboard";
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../users/user'
import { UserService } from '../../users/user.service'
import { AutoAttendantService } from '../auto-attendant.service'
import { Menus, Announcements } from '../menus';
import * as FileSaver from 'file-saver';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Button } from 'protractor';
import { Option } from '../option';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-regular-business-hours',
  templateUrl: './regular-business-hours.component.html',
  styleUrls: ['./regular-business-hours.component.scss']
})
export class RegularBusinessHoursComponent implements OnInit, AfterViewInit {
  // Reference the modal content
  @ViewChild('regBusContent') public regBusContent: ElementRef;
  currentUser: User;
  regularMenu: Menus;
  regularAnnouncement: Announcements;
  hasRegularAnnouncement = false;
  isFileUpload = false;
  isTTS = false;
  ttsMessage = "";
  selectedFile: File;
  selectedFileName: any;
  // give the keyboard a unique name
  keyboard2: Keyboard
  // reference the modal
  modalRef2: NgbModalRef
  closeResult = ''
  saving: Boolean;
  action;
  transferNumber: String;
  isAReturnFileUpload: Boolean = false;
  isAReturnTTS: Boolean = false;
  isAReleaseFileUpload: Boolean = false;
  isAReleaseTTS: Boolean = false;
  selectedAReturnFile: File;
  AReturnttsMessage = "";
  selectedAReleaseFile: File;
  AReleasettsMessage = ""
  parm: String = "";
  announcementId: String = "";
  keypress: String = ""
  value: string
  option: Option[];
  hide: Boolean = false;
  download: Boolean = false;
  mAnnouncementID: String = "";
  menu_id: String = "";
  fileToken: String = "";
  fileId: String = "";
  keyFileToken: String = "";
  keyFileId: String = "";
  ttsFileToken: String = "";
  ttsFileId: String = "";
  AReleaseTtsFileId: String = "";
  AReleaseTtsFileToken: String = "";
  AReturnTtsFileId: String = "";
  AReturnTtsFileToken: String = "";
  apiRoot: string;
  showPlayer: Boolean = true;

  constructor(
    private aaService: AutoAttendantService,
    private userService: UserService,
    private modalService: NgbModal
  ) {  
    this.userService.currentUser.subscribe(user => {
    this.currentUser = user;
    })
    this.apiRoot = `${environment.brApiUrl}`
  }


  ngOnInit() {
    this.getAutoattendantInfo();
  }

  getKeyPadHighlights() {
    for (let i in this.option){
      if(this.option[i].action === "no_mapping") {
        this.keyboard2.removeButtonTheme(this.option[i].key_press.toString(), "hg-gold");
      }
      else if(this.option[i].action === "transfer" || this.option[i].action === "announce-return" || 
      this.option[i].action === "announce-release" || this.option[i].action === "release") {
        this.keyboard2.addButtonTheme(this.option[i].key_press.toString(), "hg-gold");
      }      
    }
  }

  // beginning of modal and numberpad related methods
  ngAfterViewInit() {
    this.keyboard2 = new Keyboard(".simple-keyboard-two", {
      onChange: input => this.onInputChange(input),
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", "0"]
      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme"
    });
  }

  onChange = (input: string) => {
    const x = input
    console.log('Button = ', x)
    this.value = x
    this.openLg()
  };

  onInputChange = (input: any) => {
    // this.keyboard2.setInput(input);
    this.value = input
    this.openLg()
  };

  private openLg() {
    this.modalRef2 = this.modalService.open(this.regBusContent, { centered: true, ariaLabelledBy: 'modal-basic-title'})
    this.modalRef2.result.then((result) => {
      console.log(result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.value = null
      this.keyboard2.clearInput()
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    // Validation.
    for (let i in this.option){
      if(this.option[i].key_press === this.value)
      {
        this.showPlayer = true;
        this.AReturnttsMessage = "";
        this.AReleasettsMessage = "";
        this.isAReleaseTTS = false;
        this.isAReturnTTS = false;
        this.AReturnTtsFileId = "";
        this.AReleaseTtsFileId = "";
        this.action = this.option[i].action;
        if(this.action === "no_mapping" || this.action === "release") {
          this.transferNumber = "";
          this.announcementId = "";
        }
        else if(this.action === "transfer"){
          this.transferNumber = this.option[i].parm;
        } else if(this.action === "announce-return" || this.action === "announce-release") {
          this.announcementId = this.option[i].parm;
          console.log(this.announcementId);
          this.getKeyUploadFile(this.announcementId)
        }      
      }
    }
  }

  closeModal(){
    if (this.modalService.hasOpenModals()){
      this.modalRef2.close();
      this.value = null
      this.keyboard2.clearInput()
      this.transferNumber = "";
      this.announcementId = "";
      this.AReturnttsMessage = "";
      this.AReleasettsMessage = "";
    }
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

  // end of modal and numberpad related methods

  enableAReturnFileUpload() {
    this.isAReturnFileUpload = true;
    this.isAReturnTTS = false;
  }

  enableAReturnTTS() {
    this.isAReturnFileUpload = false;
    this.isAReturnTTS = true;
  }

  enableAReleaseFileUpload() {
    this.isAReleaseFileUpload = true;
    this.isAReleaseTTS = false;
  }

  enableAReleaseTTS() {
    this.isAReleaseFileUpload = false;
    this.isAReleaseTTS = true;
  }

  getAATTSFile() {
    if (this.action === 'announce-return') {
      this.aaService.retrieveTTSFile(this.currentUser.selectedTn.number, this.currentUser.accountId, this.AReturnttsMessage)
      .subscribe(
        (res) => {
          this.saveBlob(res)
        })
    } else if (this.action === 'announce-release') {
      this.aaService.retrieveTTSFile(this.currentUser.selectedTn.number, this.currentUser.accountId, this.AReleasettsMessage)
      .subscribe(
        (res) => {
          this.saveBlob(res)
        })
    }
  }

  downloadAAFile() {
    this.download = true;
    this.aaService.retrieveAAFile(
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      this.announcementId).subscribe((data) => {
        this.saveBlob(data);
        this.download = false;
      }, (error) => {
        this.download = false;
      })
  }

  uploadAAFile() {
    if(this.announcementId === ""){
      this.saveUploadAAFile();
    }
    else {
      this.updateUploadAAFile();
    }
  }

  saveUploadAAFile() {
    console.log(this.regularMenu.announcement_id)
    const reader = new FileReader();
    this.aaService.addAnnouncementFile(this.currentUser.selectedTn.number, this.currentUser.accountId,
      "addannouncement", this.announcementId, this.selectedFile, this.action)
      .subscribe((data) => {
        let jsonResponse = this.aaService.parseXml(data);
        let obj = jsonResponse["Response"]["AutoAttendant"];
        this.announcementId = obj["AnnouncementID"];
        console.log(this.announcementId);
      })
  }

  updateUploadAAFile() {
    this.aaService.updateAnnouncementFile(this.currentUser.selectedTn.number, this.currentUser.accountId,
      "updateannouncement", this.announcementId, this.selectedFile, this.action)
      .subscribe((data) => {
        let jsonResponse = this.aaService.parseXml(data);
        let obj = jsonResponse["Response"]["AutoAttendant"];
        this.announcementId = obj["AnnouncementID"];
      })
  }

  getAA(menu_id) {
    this.aaService.getAAKey(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      'menuoptions',
      menu_id).subscribe((data) => {
        let jsonResponse = this.aaService.parseXml(data);
        let obj = jsonResponse["Response"]["AutoAttendant"]["Menu"]["Option"];
        this.option = obj;
        this.getKeyPadHighlights()
      }, (error) =>{})
  }

  setAA() {
    this.saving = true;
    if(this.action === "transfer") {
      this.parm = this.transferNumber;
    } else if (this.action === "announce-return" || this.action === "announce-release") {
      this.parm = this.announcementId;
    } else {
      this.parm = '';
    }
    this.aaService.setAAKey(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      'menuoptions',
      this.menu_id,
      this.action,
      this.value,
      this.parm).subscribe((data) => {
        // assign variables and call methods to clear input and close modal
        for (let i in this.option){
          if(this.option[i].key_press === this.value)
          {
            this.option[i].action = this.action;
            if(this.action === "no_mapping") {
              this.option[i].parm = "";
              this.keyboard2.removeButtonTheme(this.value.toString(), "hg-gold")
            }
            else if (this.action === "release") {
              this.option[i].parm = "";
              this.keyboard2.addButtonTheme(this.value.toString(), "hg-gold");
            }
            else if(this.action === "transfer"){
              this.option[i].parm = this.transferNumber;
              this.keyboard2.addButtonTheme(this.value.toString(), "hg-gold");
            } else if(this.action === "announce-return" || this.action === "announce-release") {
              this.option[i].parm = this.announcementId;
              this.keyboard2.addButtonTheme(this.value.toString(), "hg-gold");
            }
            console.log(this.option[i]);
          }
        }
        this.saving = false;
        this.keyboard2.clearInput()
        this.modalRef2.close()
      }, (error) => {
        this.saving = false;
        // assign variables and call methods to clear input and close modal
        this.value = null
        this.keyboard2.clearInput()
        this.modalRef2.close()
      })
 
  }

  getUploadFile(aa_announcementid) {
    this.aaService.retrieveUploadFile(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      aa_announcementid).subscribe((data) => {
        let jsonResponse = this.aaService.parseXml(data);
        let obj = jsonResponse["Response"]["AutoAttendant"]
        this.fileToken = obj["file_token"]
        this.fileId = obj["fileid"]
      }, (error) => {})
  }

  getUploadFileURL() {
    return `${this.apiRoot}/tn/stream/getannouncementfile?tn=` + this.currentUser.selectedTn.number + 
    "&accountid=" + this.currentUser.accountId +
    "&token=" + this.fileToken +
    "&fileid=" + this.fileId
  }

  getKeyUploadFile(aa_announcementid) {
    this.aaService.retrieveUploadFile(
      this.currentUser.token,
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      aa_announcementid).subscribe((data) => {
        let jsonResponse = this.aaService.parseXml(data);
        let obj = jsonResponse["Response"]["AutoAttendant"]
        this.keyFileToken = obj["file_token"]
        this.keyFileId = obj["fileid"]
      }, (error) => {})
  }

  getKeyUploadFileURL() {
    return `${this.apiRoot}/tn/stream/getannouncementfile?tn=` + this.currentUser.selectedTn.number + 
    "&accountid=" + this.currentUser.accountId +
    "&token=" + this.keyFileToken +
    "&fileid=" + this.keyFileId
  }

  getTTSPreviewFile() {
    this.aaService.retrieveTTSPreviewFile(
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      'updateannouncement',
      this.mAnnouncementID,
      this.ttsMessage).subscribe((data) => {
        let jsonResponse = this.aaService.parseXml(data);
        let obj = jsonResponse["Response"]["TextToSpeech"]
        this.ttsFileToken = obj["file_token"];
        this.ttsFileId = obj["fileid"];
      }, (error) => {})
  }

  getTTSPreviewFileURL() {
    return `${this.apiRoot}/tn/stream/getttsfile?tn=` + this.currentUser.selectedTn.number + 
    "&accountid=" + this.currentUser.accountId +
    "&token=" + this.ttsFileToken +
    "&fileid=" + this.ttsFileId
  }

  getAReleaseTTSPreviewFile() {
    this.aaService.retrieveTTSPreviewFile(
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      'updateannouncement',
      this.mAnnouncementID,
      this.AReleasettsMessage).subscribe((data) => {
        let jsonResponse = this.aaService.parseXml(data);
        let obj = jsonResponse["Response"]["TextToSpeech"]
        this.AReleaseTtsFileToken = obj["file_token"];
        this.AReleaseTtsFileId = obj["fileid"];
      }, (error) => {})
  }

  getAReleaseTTSPreviewFileURL() {
    return `${this.apiRoot}/tn/stream/getttsfile?tn=` + this.currentUser.selectedTn.number + 
    "&accountid=" + this.currentUser.accountId +
    "&token=" + this.AReleaseTtsFileToken +
    "&fileid=" + this.AReleaseTtsFileId
  }

  getAReturnTTSPreviewFile() {
    this.aaService.retrieveTTSPreviewFile(
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      'updateannouncement',
      this.mAnnouncementID,
      this.AReturnttsMessage).subscribe((data) => {
        let jsonResponse = this.aaService.parseXml(data);
        let obj = jsonResponse["Response"]["TextToSpeech"]
        this.AReturnTtsFileToken = obj["file_token"];
        this.AReturnTtsFileId = obj["fileid"];
      }, (error) => {})
  }

  getAReturnTTSPreviewFileURL() {
    return `${this.apiRoot}/tn/stream/getttsfile?tn=` + this.currentUser.selectedTn.number + 
    "&accountid=" + this.currentUser.accountId +
    "&token=" + this.AReturnTtsFileToken +
    "&fileid=" + this.AReturnTtsFileId
  }

  saveTTS() {
    if(this.mAnnouncementID == "") {
      // Add File.
      this.aaService.setTTSFile(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'addannouncement',
        'announce-release',
        this.ttsFileId).subscribe((data) => {
          let jsonResponse = this.aaService.parseXml(data);
          let obj = jsonResponse["Response"]["AutoAttendant"];
          this.mAnnouncementID = obj["AnnouncementID"];
          this.fileToken = this.ttsFileToken;
          this.fileId = this.ttsFileId
          this.getAutoattendantInfo();
        }, (error) => {})
    } else {
      // Update File.
      this.aaService.updateTTSFile(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'updateannouncement',
        this.mAnnouncementID,
        this.ttsFileId).subscribe((data) => {
          let jsonResponse = this.aaService.parseXml(data);
          let obj = jsonResponse["Response"]["AutoAttendant"];
          this.mAnnouncementID = obj["AnnouncementID"];
          this.fileToken = this.ttsFileToken;
          this.fileId = this.ttsFileId
          this.getAutoattendantInfo();
        }, (error) => {})
    }
  }

  saveAReturnTTS() {
    if(this.announcementId == "") {
      // Add File.
      this.aaService.setTTSFile(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'addannouncement',
        this.action,
        this.AReturnTtsFileId).subscribe((data) => {
          let jsonResponse = this.aaService.parseXml(data);
          let obj = jsonResponse["Response"]["AutoAttendant"];
          this.announcementId = obj["AnnouncementID"];
          this.showPlayer = false;
        }, (error) => {})
    } else {
      // Update File.
      this.aaService.updateTTSFile(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'updateannouncement',
        this.announcementId,
        this.AReturnTtsFileId).subscribe((data) => {
          let jsonResponse = this.aaService.parseXml(data);
          let obj = jsonResponse["Response"]["AutoAttendant"];
          this.announcementId = obj["AnnouncementID"];
          this.showPlayer = false;
        }, (error) => {})
    }
  }

  saveAReleaseTTS() {
    if(this.announcementId == "") {
      // Add File.
      this.aaService.setTTSFile(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'addannouncement',
        this.action,
        this.AReleaseTtsFileId).subscribe((data) => {
          let jsonResponse = this.aaService.parseXml(data);
          let obj = jsonResponse["Response"]["AutoAttendant"];
          this.announcementId = obj["AnnouncementID"];
          this.showPlayer = false;
        }, (error) => {})
      } else {
      // Update File.
      this.aaService.updateTTSFile(
        this.currentUser.selectedTn.number,
        this.currentUser.accountId,
        'updateannouncement',
        this.announcementId,
        this.AReleaseTtsFileId).subscribe((data) => {
          let jsonResponse = this.aaService.parseXml(data);
          let obj = jsonResponse["Response"]["AutoAttendant"];
          this.announcementId = obj["AnnouncementID"];
          this.showPlayer = false;
        }, (error) => {})
      }
  }
 
  enableFileUpload() {
    this.isFileUpload = true;
    this.isTTS = false;
  }

  enableTTS() {
    this.isFileUpload = false;
    this.isTTS = true;
  }

  addFile(aafile: any) {
    this.selectedFile = aafile.files[0];
    this.selectedFileName = aafile.files[0].name;
    //console.log(this.selectedFileName)
  }

  saveUploadFile() {
    //console.log(this.ttsMessage)
    //console.log()vcx
    //this.getAutoattendantAnnouncements()
    console.log(this.regularMenu.announcement_id)
    const reader = new FileReader();
    //reader.readAsDataURL(this.selectedFile)
    //console.log(reader.result)
    this.aaService.addAnnouncementFile(this.currentUser.selectedTn.number, this.currentUser.accountId,
      "addannouncement", Number(this.regularMenu.announcement_id), this.selectedFile, "announce-release")
      .subscribe(
        (res:'text') => {
          const json = this.aaService.parseXml(res)
          console.log(json)
        }
      )
  }

  updateUploadFile() {
    //console.log(this.ttsMessage)
    //console.log()vcx
    //this.getAutoattendantAnnouncements()
    console.log(this.regularMenu)
    //reader.readAsDataURL(this.selectedFile)
    //console.log(reader.result)
    this.aaService.updateAnnouncementFile(this.currentUser.selectedTn.number, this.currentUser.accountId,
      "updateannouncement", Number(this.regularMenu.announcement_id), this.selectedFile, "announce-release")
      .subscribe(
        (res:'text') => {
          const json = this.aaService.parseXml(res)
          console.log(json)
        }
      )
  }

  uploadFile() {
    if(this.regularMenu.announcement_id === "") {
      this.saveUploadFile()
    }
    else {
      this.updateUploadFile()
    }
  }
  getTTSFile() {
    this.aaService.retrieveTTSFile(this.currentUser.selectedTn.number, this.currentUser.accountId, this.ttsMessage)
      .subscribe(
        (res) => {
          this.saveBlob(res)
          //const json = this.aaService.parseXml(res)
          //console.log(json)
        }
      )
  }

  downloadMAAFile() {
    this.download = true;
    this.aaService.retrieveAAFile(
      this.currentUser.selectedTn.number,
      this.currentUser.accountId,
      this.mAnnouncementID).subscribe((data) => {
        this.saveBlob(data);
        this.download = false;
      }, (error) => {
        this.download = false;
      })
  }

  getAutoattendantInfo() {
    this.aaService.retrieveAutoattendantInfo(this.currentUser.selectedTn.number, this.currentUser.accountId, "menus")
      .subscribe(
        (res: 'text') => {
          const json = this.aaService.parseXml(res)
          switch (json['Response']['AutoAttendant']['Menu'][0]['name']) {
            case "Business Hours":
              this.regularMenu = json['Response']['AutoAttendant']['Menu'][0];
              this.mAnnouncementID = this.regularMenu.announcement_id;
              this.menu_id = this.regularMenu.menu_id;
              this.getUploadFile(this.mAnnouncementID);
              this.getAA(this.menu_id);
              break;
            default: 
              null
              break;
          }
          switch (json['Response']['AutoAttendant']['Menu'][1]['name']) {
            case "Business Hours":
              this.regularMenu = json['Response']['AutoAttendant']['Menu'][1];
              this.mAnnouncementID = this.regularMenu.announcement_id;
              this.menu_id = this.regularMenu.menu_id;
              this.getUploadFile(this.mAnnouncementID);
              this.getAA(this.menu_id);
              break;
            default: 
              null
              break;
          }
          switch (json['Response']['AutoAttendant']['Menu'][2]['name']) {
            case "Business Hours":
              this.regularMenu = json['Response']['AutoAttendant']['Menu'][2];
              this.mAnnouncementID = this.regularMenu.announcement_id;
              this.menu_id = this.regularMenu.menu_id;
              this.getUploadFile(this.mAnnouncementID);
              this.getAA(this.menu_id);
              break;
            default: 
              null
              break;
          }
        }
      )
  }

  getAutoattendantAnnouncements() {
    this.aaService.retrieveAutoattendantAnouncements(this.currentUser.selectedTn.number, this.currentUser.accountId, "announcements", Number(this.regularMenu.announcement_id))
      .subscribe(
        (res: 'text') => {
          const json = this.aaService.parseXml(res)
          switch (json['Response']['AutoAttendant']['Announcements']['Announcement'][0]['name']) {
            case "Business Hours":
              this.regularAnnouncement = json['Response']['AutoAttendant']['Announcements']['Announcement'][0];
              break;
            default: 
              null
              break;
          }
          switch (json['Response']['AutoAttendant']['Announcements']['Announcement'][1]['name']) {
            case "Business Hours":
              this.regularAnnouncement = json['Response']['AutoAttendant']['Announcements']['Announcement'][1];
              break;
            default: 
              null
              break;
          }
          switch (json['Response']['AutoAttendant']['Announcements']['Announcement'][2]['name']) {
            case "Business Hours":
              this.regularAnnouncement = json['Response']['AutoAttendant']['Announcements']['Announcement'][2];
              break;
            default: 
              null
              break;
          }
          console.log(this.regularAnnouncement)
        })
  }

  saveBlob(blob) {
    let myBlob = new Blob([blob], {
      type: "audio/wav"
    });
    FileSaver.saveAs(myBlob, "tts.wav");
  }

}
