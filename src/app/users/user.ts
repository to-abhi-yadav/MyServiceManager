import { Branding } from "../shared/models/branding";

export class User {
    token: string
    userProfile: any
    expiryDate: string
    userName: string
    company: string
    type: string
    accountId: string
    componentSequence: string
    subId: string
    telephoneNumbers: any
    selectedTn: any;
    branding?: Branding;

    constructor({
        token = "",
        userProfile = "",
        expiryDate = "",
        userName = "",
        company = "",
        type = "",
        accountId = "",
        componentSequence = "",
        subId = "",
        telephoneNumbers = [{}],
        selectedTn = {},
        ...rest
    }) {
        this.token = token;
        this.userProfile = userProfile;
        this.expiryDate = expiryDate;
        this.userName = userName;
        this.company = company;
        this.type = type
        this.accountId = accountId;
        this.componentSequence = componentSequence;
        this.subId = subId;
        this.telephoneNumbers = telephoneNumbers;
        this.selectedTn = selectedTn;
        this.branding = rest.branding ? new Branding(rest.branding) : new Branding(rest)
    }

    selectDefaultTn(tns) {
        // Set TN based off if array or not
        let sn = '';
        if (tns.length > 1){
          sn = tns["tn"][0]["number"]
        } else if (typeof tns === "object"){
          sn = tns["tn"]["number"]
        } else {
          // Has no numbers
          sn = ''
        }
        return sn;
    }
}
