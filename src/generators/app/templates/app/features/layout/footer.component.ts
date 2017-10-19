import {CONFIG} from "app/config";
import {Component} from "@angular/core";

@Component({
    selector: 'app-footer',
    template: `
        <footer id="main-footer">
            Version : {{ config.version }}
            - Build date : {{ config.buildDate | date:'dd-MM-y' }}
        </footer>
    `
})
export class FooterComponent {
    config = CONFIG;
}
