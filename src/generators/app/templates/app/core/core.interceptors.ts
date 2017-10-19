import {NgModule, Injectable} from '@angular/core';
import {
    HTTP_INTERCEPTORS,
    HttpClientModule,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';

import {Observable} from 'rxjs';


@Injectable()
export class SampleInterceptor implements HttpInterceptor
{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        return next.handle(req);
    }
}



@NgModule({
    imports: [ HttpClientModule ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: SampleInterceptor, multi: true }
    ]
})
export class InterceptorsModule {}
