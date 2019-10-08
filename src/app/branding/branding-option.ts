export class BrandingOption {
    primaryFontColor: string
    secondaryFontColor: string
    primaryButtonColor: string
    secondaryButtonColor: string
    backgroundColor: string
    constructor({
        primaryFontColor = "",
        secondaryFontColor = "",
        primaryButtonColor = "",
        secondaryButtonColor = "",
        backgroundColor = "",
        ...rest
    }) {
        this.primaryFontColor = primaryFontColor;
        this.secondaryFontColor = secondaryFontColor;
        this.primaryButtonColor = primaryButtonColor
        this.secondaryButtonColor = secondaryButtonColor;
        this.backgroundColor = backgroundColor;
    }
}
