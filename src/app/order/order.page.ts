import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import * as lodash from 'lodash'

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  data = [{ name: 'Ferry', date: '01 May 22. 15.43 joined' },
  { name: 'Jerry', date: '05 May 22. 15.43 joined' },
  { name: 'Gary', date: '07 May 22. 15.43 joined' },
  { name: 'Barry', date: '18 May 22. 15.43 joined' },
  { name: 'Larry', date: '25 May 22. 15.43 joined' }]

  membership = [{ name: 'Bitcoin', name2: 'BTCUSD', current_value: '38965.2', rates: '-3.85', picture: '/assets/icon/q.png', id: 1 },
  { name: 'Ethereum', name2: 'ETHUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/ethereum-eth-logo.png', id: 2 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 }
  ]

  today = new Date().getTime()
  interval3
  interval2
  currentUser = {}
  passOrders = []
  orderCountDownDate;
  resultCountDownDate;

  constructor(private nav: NavController, private datePipe: DatePipe, private http: HttpClient) { }

  ngOnInit() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']

        })

        var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)
        var start;
        var end

        if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
          start = cutOff
          end = new Date(cutOff).setDate(new Date(cutOff).getDate() + 1);
        } else {
          start = new Date(cutOff).setDate(new Date(cutOff).getDate() - 1);
          end = cutOff
        }


        this.http.post(baseUrl + '/getOrdersByUid', { userid: firebase.auth().currentUser.uid, start: start, end: end, date: this.datePipe.transform(start, 'dd-MM-yyyy') }).subscribe((res) => {
          this.passOrders = res['data']
          console.log(this.passOrders)
          this.passOrders = lodash.chain(this.passOrders)
            // Group the elements of Array based on `color` property
            .groupBy("coinid")
            // `key` is group's name (color), `value` is the array of objects
            .map((value, key) => ({ coinid: key, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: 2, investamount: value[0]['sum'] }))
            .value()

        })
      }
    })

  }

  ionViewDidEnter() {
    this.lastOrderCountDown()
    this.resultCountDown()
  }

  back() {
    this.nav.pop()
  }

  goprofile() {
    this.nav.navigateForward('profile')
  }

  godetails() {
    this.nav.navigateForward('order-details')
  }

  resultCountDown() {
    // Update the count down every 1 second
    this.interval2 = setInterval(() => {
      this.resultCountDownDate = new Date().setHours(20, 0, 0, 0)

      if (parseInt(this.datePipe.transform(Date.now(), 'HHmmss')) >= 200000) {
        this.resultCountDownDate = new Date(this.resultCountDownDate).setDate(new Date(this.resultCountDownDate).getDate() + 1);
      }

      var now = Date.now()
      var distance = this.resultCountDownDate - now;

      let hourChange = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()
      let minChange = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()
      let secChange = Math.floor((distance % (1000 * 60)) / 1000).toString()
      document.getElementById("hours3").innerText = (hourChange.length == 1 ? '0' : '') + hourChange
      document.getElementById("minutes3").innerText = (minChange.length == 1 ? '0' : '') + minChange
      document.getElementById("seconds3").innerText = (secChange.length == 1 ? '0' : '') + secChange


    }, 1000);
  }

  lastOrderCountDown() {
    // Update the count down every 1 second
    this.interval3 = setInterval(() => {
      this.orderCountDownDate = new Date().setHours(16, 0, 0, 0)

      if (parseInt(this.datePipe.transform(Date.now(), 'HHmmss')) >= 160000) {
        this.orderCountDownDate = new Date(this.orderCountDownDate).setDate(new Date(this.orderCountDownDate).getDate() + 1);
      }

      var now = Date.now()
      var distance = this.orderCountDownDate - now;

      let hourChange = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()
      let minChange = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()
      let secChange = Math.floor((distance % (1000 * 60)) / 1000).toString()
      document.getElementById("hours2").innerText = (hourChange.length == 1 ? '0' : '') + hourChange
      document.getElementById("minutes2").innerText = (minChange.length == 1 ? '0' : '') + minChange
      document.getElementById("seconds2").innerText = (secChange.length == 1 ? '0' : '') + secChange

    }, 1000);
  }

  ionViewWillLeave() {
    clearInterval(this.interval2)
    clearInterval(this.interval3)
  }

}
