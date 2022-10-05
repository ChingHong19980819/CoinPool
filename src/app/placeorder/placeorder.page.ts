import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.page.html',
  styleUrls: ['./placeorder.page.scss'],
})
export class PlaceorderPage implements OnInit {

  constructor(private nav: NavController, private http: HttpClient, private modal: ModalController, private datePipe: DatePipe) { }

  today = new Date().getTime()
  currentUser = {}
  amount
  interval5
  orderCountDownDate

  ngOnInit() {
    this.lastOrderCountDown()
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })
      }
    })
  }

  back() {
    this.modal.dismiss()
  }

  toprofile() {

    this.nav.navigateForward('profile')
  }

  confirm() {
    this.modal.dismiss(this.amount)
  }


  lastOrderCountDown() {
    // Update the count down every 1 second
    this.interval5 = setInterval(() => {
      this.orderCountDownDate = new Date().setHours(16, 0, 0, 0)

      if (parseInt(this.datePipe.transform(Date.now(), 'HHmmss')) >= 160000) {
        this.orderCountDownDate = new Date(this.orderCountDownDate).setDate(new Date(this.orderCountDownDate).getDate() + 1);
      }

    }, 1000);
  }

  ionViewWillLeave() {
    clearInterval(this.interval5)
  }
}
