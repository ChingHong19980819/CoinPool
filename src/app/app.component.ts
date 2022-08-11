import { Component } from '@angular/core';
import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from './app.firebase.config';
// import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    // private fcm: FCM,
    private platform: Platform

  ) {
    firebase.initializeApp(FIREBASE_CONFIG);
    this.platform.ready().then(() => {


      // this.fcm.getToken().then((token) => {
      //   alert(token)
      // })
    })
  }
}
