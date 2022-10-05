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
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

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
  currentUser: any = {}
  passOrders = []
  orderCountDownDate;
  resultCountDownDate;
  coinList = []
  selected = { name: 'Bitcoin' } as any;
  summaryResult = []


  lang = localStorage.getItem('coinpool_language') || 'English'
  langua = {
    ["Order Cut-off Time"]: {
      Chinese: "订单截止时间",
      English: "Order Cut-off Time",
    }, ["Hour"]: {
      Chinese: "小时",
      English: "Hour",
    }, ["Minutes"]: {
      Chinese: "分钟",
      English: "Minutes",
    }, ["Sec"]: {
      Chinese: "秒",
      English: "Sec",
    }, ["Credit Balance"]: {
      Chinese: "可用额度",
      English: "Credit Balance",
    }, ["Result"]: {
      Chinese: "成绩倒计时",
      English: "Result",
    }, ["Order"]: {
      Chinese: "下单",
      English: "Order",
    }
  }

  level = 'low'


  constructor(private nav: NavController, private datePipe: DatePipe, private http: HttpClient, private outlet: IonRouterOutlet, private router: Router) { }

  ngOnInit() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']

        })

        this.http.post(baseUrl + '/getCoinList', {}).subscribe((a) => {
          this.coinList = a['data'].map(c => ({ ...c, amount: 0, percentage: 0, transactionid: user.uid + Date.now() + c['name'] })).sort((v, d) => v['orders'] - d['orders'])
          // this.selected['name'] = this.coinList[0]['name']
          // this.selected['id'] = this.coinList[0]['id']
        })

        this.http.post(baseUrl + '/getSummaryResult', {}).subscribe((a) => {
          this.summaryResult = a['data']
        })




        var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)
        var date

        if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
          date = this.datePipe.transform(new Date(cutOff).setDate(new Date(cutOff).getDate() + 1), 'dd-MM-yyyy')
        } else {
          date = this.datePipe.transform(new Date(cutOff), 'dd-MM-yyyy')
        }

        this.http.post(baseUrl + '/getOrdersByUid', { userid: firebase.auth().currentUser.uid, date: date }).subscribe((res) => {
          this.passOrders = res['data']
          this.passOrders = lodash.chain(this.passOrders)
            // Group the elements of Array based on `color` property
            .groupBy(g => g['coinid'] + g['level'])
            // `key` is group's name (color), `value` is the array of objects
            .map((value, key) => ({ coinid: value[0]['coinid'], level: value[0]['level'], coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: value[0]['percentage'], investamount: value[0]['sum'] / 100 }))
            .value()

          console.log(this.passOrders)
        })
      }
    })

  }

  ionViewDidEnter() {
    this.lastOrderCountDown()
    this.resultCountDown()
  }

  changeCoin(selected) {
    this.selected.name = selected.name;
    this.selected.id = selected.id
    this.selected['amount'] = this.coinList.find(c => c['id'] == this.selected['id'])['amount'] || 0
    // this.rangevalue = this.selected['amount'] / this.currentUser['amount'] * 100
  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['home'], { replaceUrl: true });
  }

  goprofile() {
    this.nav.navigateForward('profile')
  }

  godetails(x) {
    this.nav.navigateForward('order-details?id=' + x + '&level=' + this.level)
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

  summaryById(coinid) {
    return ((this.passOrders.find(x => x['coinid'] == coinid && x['level'] == this.level) || {}).investamount || 0)
  }

}
