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
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

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
  credit_logs = []
  commission_logs = []
  invoices = []
  code = ''
  result = false
  allrecords = []

  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["My Wallets"]: {
      Chinese: "我的钱包",
      English: "My Wallets",
    }, ["Top Up"]: {
      Chinese: "充值",
      English: "Top Up",
    }, ["Withdraw"]: {
      Chinese: "提款",
      English: "Withdraw",
    }, ["History"]: {
      Chinese: "历史记录",
      English: "History"
    }, ["Member ID"]: {
      Chinese: "会员ID",
      English: "Member ID"
    },
    ["SILVER"]: {
      Chinese: "白银",
      English: "SILVER"
    },
    ["GOLD"]: {
      Chinese: "黄金",
      English: "GOLD"
    },
    ["PLATINUM"]: {
      Chinese: "铂金",
      English: "PLATINUM"
    },
    ["MEMBER"]: {
      Chinese: "会员",
      English: "MEMBER"
    },
    ["Ranking Commission"]: {
      Chinese: "排名佣金",
      English: "Ranking Commission"
    }
    ,
    ["No transaction yet"]: {
      Chinese: "暂无交易记录",
      English: "No transaction yet"
    }, ["Available Credit"]: {
      Chinese: "可用额度",
      English: "Available Credit",
    }, ["Credit"]: {
      Chinese: "积分",
      English: "Credit",
    },
  }


  constructor(private nav: NavController, private datePipe: DatePipe, private http: HttpClient, private carPool: CarpoolService, private outlet: IonRouterOutlet, private router: Router) { }

  ngOnInit() {
    var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(0, 0, 0, 0)

    // if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
    this.selectedDate = new Date(new Date().setHours(0, 0, 0, 0))
    // } else {
    //   this.selectedDate = this.datePipe.transform(cutOff, 'yyyy-MM-dd')
    // }
    // this.selectedDate = this.datePipe.transform(cutOff, 'yyyy-MM-dd')

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo2', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
          this.code = this.carPool.encodeIds(a['data']['id'])
        })

        this.getOrders()




      }
    })
  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['profile'], { replaceUrl: true });
  }

  gotopup() {
    this.nav.navigateForward('topup')
  }

  gowithdraw() {
    this.nav.navigateForward('withdrawal')
  }

  getOrders() {

    this.passOrders = []


    let date = this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy')

    this.withdraws = []
    this.credit_logs = []
    this.invoices = []
    this.commission_logs = []
    this.passOrders = []
    this.allrecords = []

    this.http.post(baseUrl + '/getWithdrawByUid', {
      userid: firebase.auth().currentUser.uid,
      start: new Date(this.selectedDate).getTime(), end: new Date(this.selectedDate).getTime() + (24 * 60 * 60 * 1000)
    }).subscribe((res) => {
      this.withdraws = res['data']
      this.allrecords = this.allrecords.concat(this.withdraws.map((w => ({ ...w, type: 'withdraw' }))))
    })

    this.http.post(baseUrl + '/getCreditLogsByUid', {
      userid: firebase.auth().currentUser.uid,
      start: new Date(this.selectedDate).getTime(), end: new Date(this.selectedDate).getTime() + (24 * 60 * 60 * 1000)
    }).subscribe((res) => {
      this.credit_logs = res['data']
      this.allrecords = this.allrecords.concat(this.credit_logs.map((w => ({ ...w, type: 'credit' }))))

    })

    this.http.post(baseUrl + '/getInvoicesByUid', {
      userid: firebase.auth().currentUser.uid,
      start: new Date(this.selectedDate).getTime(), end: new Date(this.selectedDate).getTime() + (24 * 60 * 60 * 1000)
    }).subscribe((res) => {
      this.invoices = res['data']
      this.allrecords = this.allrecords.concat(this.invoices.map((w => ({ ...w, type: 'invoices' }))))

    })

    this.http.post(baseUrl + '/getCommisionByUid', {
      userid: firebase.auth().currentUser.uid,
      start: new Date(this.selectedDate).getTime(), end: new Date(this.selectedDate).getTime() + (24 * 60 * 60 * 1000)
    }).subscribe((res) => {
      this.commission_logs = res['data']
      this.allrecords = this.allrecords.concat(this.commission_logs.map((w => ({ ...w, type: 'commission' }))))

    })

    this.http.post(baseUrl + '/getTransactions', { userid: firebase.auth().currentUser.uid, date: date }).subscribe((res) => {
      this.result = res['data'].length > 0 ? res['data'][0]['result'] : false

      this.passOrders = res['data']
      this.passOrders = lodash.chain(this.passOrders)
        // Group the elements of Array based on `color` property
        .groupBy("coinid")
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ coinid: key, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: value[0]['percentage'], investamount: value.reduce((a, b) => a + b['sum'], 0) / 100 }))
        .value()


      this.allrecords = this.allrecords.concat(this.passOrders.map((w => ({ ...w, type: 'orders' }))))


    })
  }

  returnSort() {
    return this.allrecords.sort((a, b) => b['date'] - a['date'])
  }
}
