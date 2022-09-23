import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {
  constructor(private nav: NavController, private platform: Platform) {

  }

  versionAndroid = '000001'
  versioniOS = '000001'

  canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {
    return new Promise((resolve) => {
      firebase.database().ref('reveiwing').on('value', bundle => {
        if (this.platform.is('android')) {
          firebase.database().ref('/reviewing/android/' + this.versionAndroid).on('value', data => {
            if (data.val() == false) {
              this.nav.navigateRoot('login')
            } else {
              this.nav.navigateRoot('exchange-rate')
            }
          })
        }

        if (this.platform.is('ios')) {
          firebase.database().ref('/reviewing/ios/' + this.versioniOS).on('value', data => {
            if (data.val() == false) {
              this.nav.navigateRoot('login')
            } else {
              this.nav.navigateRoot('exchange-rate')
            }
          })
        }
      })

    })
  }



}
