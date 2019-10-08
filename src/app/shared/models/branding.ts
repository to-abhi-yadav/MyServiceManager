export class Branding {
    fontFamily: string
    logo: string
    taglineFontFamily: string
    taglineFontColor: string
    primaryFontColor: string
    secondaryFontColor: string
    primaryButtonColor: string
    secondaryButtonColor: string
    backgroundColor: any
    companyName: any;
    forwardingUrl?: string;
    constructor({
        fontFamily = "",
        logo = "",
        taglineFontFamily = "",
        taglineFontColor = "",
        primaryFontColor = "",
        secondaryFontColor = "",
        primaryButtonColor = "",
        secondaryButtonColor = "",
        backgroundColor = "",
        companyName = "",
        forwardingUrl = "",
        ...rest
    }) {
        this.fontFamily = fontFamily;
        this.logo = logo;
        this.taglineFontFamily = taglineFontFamily;
        this.taglineFontColor = taglineFontColor;
        this.primaryFontColor = primaryFontColor;
        this.secondaryFontColor = secondaryFontColor;
        this.primaryButtonColor = primaryButtonColor;
        this.secondaryButtonColor = secondaryButtonColor;
        this.backgroundColor = backgroundColor;
        this.companyName = companyName;
        this.forwardingUrl = forwardingUrl;
    }
}
