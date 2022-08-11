import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private nav: NavController, private http: HttpClient) { }

  currentUser = {}
  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })
      }
    })

  }

  gowallet() {

    this.nav.navigateForward('mywallet')
  }

  gorefer() {

    this.nav.navigateForward('refer')
  }

  goverify() {

    this.nav.navigateForward('acc-verify')
  }

  goguide() {

    this.nav.navigateForward('guideline')
  }

  back() {
    this.nav.pop()
  }

  goupdate() {
    this.nav.navigateForward('updateprofile')
  }

  gorecordhistory() {

  }

  signout() {
    firebase.auth().signOut().then(() => {
      this.nav.navigateRoot('login')
    })
  }
}
