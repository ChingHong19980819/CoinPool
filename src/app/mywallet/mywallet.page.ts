import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { baseUrl } from 'src/environments/environment.prod';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import * as lodash from 'lodash'
import { CarpoolService } from '../carpool.service';

@Component({
  selector: 'app-mywallet',
  templateUrl: './mywallet.page.html',
  styleUrls: ['./mywallet.page.scss'],
})
export class MywalletPage implements OnInit {

  today = new Date().getTime()

  membership = [{ name: 'Bitcoin', name2: 'BTCUSD', current_value: '38965.2', rates: '-3.85', picture: '/assets/icon/q.png', id: 1 },
  { name: 'Ethereum', name2: 'ETHUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/ethereum-eth-logo.png', id: 2 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  ]

  selectedDate
  passOrders = []
  currentUser = {}
  withdraws = []
  code = ''

  constructor(private nav: NavController, private datePipe: DatePipe, private http: HttpClient, private carPool: CarpoolService) { }

  ngOnInit() {
    var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)

    if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
      this.selectedDate = this.datePipe.transform(cutOff, 'yyyy-MM-dd')
    } else {
      this.selectedDate = this.datePipe.transform(new Date(cutOff).setDate(new Date(cutOff).getDate() - 1), 'yyyy-MM-dd');
    }


    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
          console.log(this.currentUser)
          this.code = this.carPool.encodeIds(a['data']['id'])
        })

        this.getOrders()




      }
    })
  }

  back() {
    this.nav.pop()
  }

  gotopup() {
    this.nav.navigateForward('topup')
  }

  gowithdraw() {
    this.nav.navigateForward('withdrawal')
  }

  getOrders() {

    this.passOrders = []
    var start = new Date(this.selectedDate).setHours(16, 0, 0, 0)
    var end = new Date(start).setDate(new Date(start).getDate() + 1);
    // var start;
    // var end

    // if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
    //   start = cutOff
    //   end = new Date(cutOff).setDate(new Date(cutOff).getDate() + 1);
    // } else {
    //   start = new Date(cutOff).setDate(new Date(cutOff).getDate() - 1);
    //   end = cutOff
    // }



    this.http.post(baseUrl + '/getWithdrawByUid', {
      userid: firebase.auth().currentUser.uid,
      start: new Date(this.selectedDate).getTime() - (8 * 60 * 60 * 1000), end: new Date(this.selectedDate).getTime() - (8 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000)
    }).subscribe((res) => {

      this.withdraws = res['data']

      // this.passOrders = res['data']
      // console.log(this.passOrders)
      // this.passOrders = lodash.chain(this.passOrders)
      //   // Group the elements of Array based on `color` property
      //   .groupBy("coinid")
      //   // `key` is group's name (color), `value` is the array of objects
      //   .map((value, key) => ({ coinid: key, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: value[0]['percentage'], investamount: value[0]['sum'] }))
      //   .value()

    })

    this.http.post(baseUrl + '/getTransactions', { userid: firebase.auth().currentUser.uid, start: start, end: end, date: this.datePipe.transform(start, 'dd-MM-yyyy') }).subscribe((res) => {
      this.passOrders = res['data']
      console.log(this.passOrders)
      this.passOrders = lodash.chain(this.passOrders)
        // Group the elements of Array based on `color` property
        .groupBy("coinid")
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ coinid: key, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: value[0]['percentage'], investamount: value[0]['sum'] / 100 }))
        .value()

    })
  }

}
