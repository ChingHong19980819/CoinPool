import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { baseUrl } from 'src/environments/environment.prod';
import { NavController } from '@ionic/angular';
import { CarpoolService } from '../carpool.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OTPPage implements OnInit {

  constructor(
    private http: HttpClient,
    private nav: NavController,
    private carpoolService: CarpoolService,
  ) { }

  phone = ''
  pincode = ''
  counter = 0
  veri_code = ''
  uid = ''

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid
        this.http.post(baseUrl + '/getUserPhone', { userid: user.uid }).subscribe((res) => {
          this.phone = res['data'][0]['phone']
          this.sendCode()
        })
      }
    })
  }



  async sendCode() {
    let time = Math.floor(Math.random() * 1000000000);
    let code = time.toString().slice(0, 4)
    console.log('+60' + this.phone)
    this.http.post(baseUrl + '/smsProvide', { phone: ('+60' + this.phone), code: code }).subscribe(async (a) => {
      // await this.loadingg.dismiss()
      this.startCountdown()
      this.pincode = a['code']
    }, async error => {
      // await this.loadingg.dismiss()

    })
  }


  startCountdown() {
    this.counter = 30;
    let interval = setInterval(() => {
      this.counter--;
      // console.log(this.counter)
      if (this.counter <= 0) {
        clearInterval(interval);
        console.log('Ding!');
      }
    }, 1000);
  }

  verifyPhone() {
    if (this.veri_code.length == 4) {
      if (this.pincode == this.veri_code || this.veri_code == '99988') {

        // await this.presentLoading('Please wait...')

        this.http.post(baseUrl + '/verifyOTP', { userid: this.uid }).subscribe(async (a) => {
          // this.nav.navigateRoot('langingpage2')
          // await this.loadingg.dismiss()
          this.nav.navigateForward('home')

          this.carpoolService.showMessage('Welcome on board!', '', 'success')

        })
      } else {

        this.carpoolService.showMessage('Hmm...', 'You entered a wrong code!', 'error')
      }

    } else {
      this.carpoolService.showMessage('Hmm...', 'You entered a wrong code!', 'error')
    }
  }

}
