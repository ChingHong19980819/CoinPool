import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CoinpoolGuard implements CanLoad {

  constructor(private nav: NavController) {

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          if (user.emailVerified) {
            resolve(true)
          } else {
            // this.nav.navigateRoot('login')
            resolve(true)
          }
        } else {

          this.nav.navigateRoot('login')
          resolve(false)

        }

      })
    })
  }
}
