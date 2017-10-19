import * as _ from 'lodash';

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "app/models/app-config.model";

@Injectable()
export class ConfigService
{
   constructor(
      private http:HttpClient,
      public appConfig:AppConfig
   ) { }

   loadConfig(): Promise<any> {
      let url = 'app/resources/config/app-config.json';

      return this.http.get(url)
         .map(data => _.merge(this.appConfig, new AppConfig(), data))
         .toPromise();
   }
}
