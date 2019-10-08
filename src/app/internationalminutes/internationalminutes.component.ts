import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/users/user';
import { UserService } from 'src/app/users/user.service';
import { FeaturesService} from 'src/app/shared/services/features.service';

@Component({
  selector: 'app-internationalminutes',
  templateUrl: './internationalminutes.component.html',
  styleUrls: ['./internationalminutes.component.scss'],
  providers: [FeaturesService]
})
export class InternationalminutesComponent implements OnInit {
  component = 'InternationalminutesComponent'
  internationalminutes: string;
  hasError: boolean;
  errorMsg: string;
  currentUser: User;

  constructor(
    private featuresService: FeaturesService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.getinternationalminutes();
    })
  }

  getinternationalminutes() {
    this.featuresService.retrieveInternationalMinutes(this.currentUser.token,this.currentUser.selectedTn.number, this.currentUser.accountId).subscribe( data => {
      const json = this.featuresService.parseXml(data)
      if (json['Response']['Status']['Code'] === '200') {
        console.log(json['Response'])
        this.internationalminutes = json['Response']['InternationalMinutes']['Minutes']
      }
      else{
        this.hasError = true;
        this.errorMsg = "Cannot retrieve International Minutes!";
      }
    })
  }

}
