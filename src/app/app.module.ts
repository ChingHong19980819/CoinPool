import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Market } from '@ionic-native/market/ngx';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, DatePipe, SocialSharing, Camera, Market, SafariViewController],
  bootstrap: [AppComponent],
})
export class AppModule { }
