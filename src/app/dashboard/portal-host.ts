import { DomPortalHost, Portal, ComponentPortal } from "@angular/cdk/portal";
export class PortalHost {
    name: string
    domPortalHost: DomPortalHost
    tilebox: number
    constructor({
        name = "",
        domPortalHost,
        tilebox,
        ...rest
    }) {
        this.name = name;
        this.domPortalHost = domPortalHost
        this.tilebox = tilebox
        Object.assign(this, rest)
    }
}
