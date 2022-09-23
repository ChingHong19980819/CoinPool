import { Component } from '@angular/core';
import firebase from 'firebase/app';
// import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';
import 'firebase/database';
import { Market } from '@ionic-native/market/ngx';
import { UpdatePage } from './update/update.page';
import { FIREBASE_CONFIG } from './app.firebase.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  versionAndroid = '000001'
  versioniOS = '000001'

  constructor(
    // private fcm: FCM,
    private platform: Platform,
    private modalCtrl: ModalController,
    private nav: NavController

  ) {
    firebase.initializeApp(FIREBASE_CONFIG);
    this.platform.ready().then(() => {

      firebase.database().ref('bundle').on('value', bundle => {
        if (this.platform.is('android')) {
          firebase.database().ref('/versioning/android/' + this.versionAndroid).on('value', data => {
            if (data.val() == false) {
              setTimeout(() => {
                // alert('Please Update Your App in App Store')
                this.showUpdate(bundle.val()['android'])
                // navigator['app'].exitApp();
              }, 0);
            }
          })
        }

        if (this.platform.is('ios')) {
          firebase.database().ref('/versioning/ios/' + this.versioniOS).on('value', data => {
            if (data.val() == false) {
              setTimeout(() => {
                // alert('Please Update Your App in App Store')
                this.showUpdate(bundle.val()['ios'])

                // navigator['app'].exitApp();
              }, 0);
            }
          })
        }
      })



      // this.fcm.getToken().then((token) => {
      //   alert(token)
      // })
    })
  }

  async showUpdate(marketid) {
    const modal = await this.modalCtrl.create({
      component: UpdatePage,
      cssClass: 'updateModal',
      backdropDismiss: false,
      swipeToClose: false,
      componentProps: {
        marketid: marketid
      }
    });


    return await modal.present();
  }
}
