import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { CarpoolService } from '../carpool.service';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
declare var Swal;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private nav: NavController, private carpoolService: CarpoolService, private http: HttpClient) { }

  user: any = {}

  ngOnInit() {

    firebase.auth().onAuthStateChanged((user) => {
      this.carpoolService.pleasewait('Authenticating..', 'Please wait...')

      if (user) {
        // this.http.post(baseUrl + '/checkUserStatus', { userid: user.uid }).subscribe((b) => {
        this.nav.navigateRoot('home')
        this.carpoolService.swalclose()
        // })
      }

      this.carpoolService.swalclose()

    })

  }

  gosignup() {
    this.nav.navigateForward('signup')
  }

  gohome() {
    this.nav.navigateForward('home')
  }

  login() {
    if (this.carpoolService.isNullOrEmpty(this.user, ['email', 'password'])) {
      this.carpoolService.showMessage('Please fill in all information!', '', 'error')
      return
    }

    this.carpoolService.pleasewait('Authenticating..', 'Please wait...')

    firebase.auth().signInWithEmailAndPassword(this.user['email'], this.user['password']).then(() => {

    }).catch((error) => {
      this.carpoolService.swalclose()
      this.carpoolService.showMessage('Error', error.message, 'error')
    })
  }



}
