import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { VoicemailItem } from './voicemail-item.model'
import { VoicemailService } from '../voicemail.service';
import { PhonePipe } from '../../shared/pipes/phone.pipe';
import { User } from 'src/app/users/user';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';

@Component({
  selector: '[app-voicemail-item]',
  templateUrl: './voicemail-item.component.html',
  styleUrls: ['./voicemail-item.component.scss']
})
export class VoicemailItemComponent implements OnInit {
  @Input() voicemailItem: VoicemailItem;
  @Input() currentUser: User;
  playingAudio: boolean = false;
  @ViewChild('audio') private audioControl: ElementRef;
  audioFailureMessage: string = "Voicemail failed to play"
  audioFailure: boolean = false;
  audioText: string = "Play"
  public isDeleting: boolean = false;
  public isDownloading: boolean = false;

  constructor(private voicemailService: VoicemailService, private sanitizer:DomSanitizer) { }

  ngOnInit() {
  }

  downloadFile(){
    this.isDownloading = true;
    this.voicemailService.retrieveVoicemailFile(this.currentUser.accountId, this.currentUser.selectedTn.number, this.voicemailItem.messageId, this.voicemailItem.voicemailToken)
      .subscribe((data) => {
        this.saveBlob(data);
        this.isDownloading = false;
      })
  }

  deleteVoicemailItem(){
    this.isDeleting = true;
    this.voicemailService.deleteVoicemail(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number, this.voicemailItem).subscribe(data => {
      this.isDeleting = false;
      this.voicemailService.removeVoicemailFromArray(this.voicemailItem);
    });
  }

  playbackEnded(){
    this.audioText = "Replay";
    this.playingAudio = false;
    this.voicemailService.setVoicemailAsRead(this.currentUser.token, this.currentUser.accountId, this.currentUser.selectedTn.number, this.voicemailItem.messageId).subscribe(data => {
      let responseData = this.voicemailService.parseXml(data);
      if (responseData["Response"]["Status"]["Code"] == 200) {
        this.voicemailItem.reviewed = true;
      }
    })
  }

  toggleAudio(){
    if (this.playingAudio){
      this.audioControl.nativeElement.pause();
      this.playingAudio = !this.playingAudio;
    } else {
      let playPromise = this.audioControl.nativeElement.play();
      playPromise.then(() => {
        this.playingAudio = !this.playingAudio;
        this.audioText = "Play";
      }).catch(function(error) {
        // Automatic playback failed.
        // Show notice it failed to play
        this.audioFailure = true;
      });
    }
  }

  saveBlob(blob) {
    let myBlob = new Blob([blob], {
      type: "audio/wav"
    });
    FileSaver.saveAs(myBlob, "voicemail.wav");
  }

}
