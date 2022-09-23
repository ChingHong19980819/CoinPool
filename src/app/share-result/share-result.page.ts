import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { ActivatedRoute } from '@angular/router';
import { CarpoolService } from '../carpool.service';
import * as lodash from 'lodash'


@Component({
  selector: 'app-share-result',
  templateUrl: './share-result.page.html',
  styleUrls: ['./share-result.page.scss'],
})
export class ShareResultPage implements OnInit {

  membership = [{ name: 'Bitcoin', name2: 'BTCUSD', current_value: '38965.2', rates: '-3.85', picture: '/assets/icon/q.png', id: 1 },
  { name: 'Ethereum', name2: 'ETHUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/ethereum-eth-logo.png', id: 2 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '38965.2', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 }
  ]

  today = new Date().getTime()
  PW = [] as any;
  currentUser = {}
  result_date = '07-08-2022'
  results = []
  result = false
  code = ''
  show = false
  result2 = false
  showDate;
  earnedAmount;
  notradeOrders = []

  constructor(private nav: NavController, private platform: Platform, private http: HttpClient, private activatedRoute: ActivatedRoute,
    private carPool: CarpoolService) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((a) => {
      if (a['uid'] && a['date']) {
        this.code = a['uid']
        this.result_date = a['date']
        this.showDate = this.result_date.split('-')[0] + '.' + this.result_date.split('-')[1] + '.' + this.result_date.split('-')[2]
        this.http.post(baseUrl + '/getUserInfoByUid', { userid: this.code }).subscribe((a) => {
          this.currentUser = a['data'] || {}
        })


        this.http.post(baseUrl + '/getResultByDate2', { tradeindate: this.result_date, userid: this.code }).subscribe((res) => {
          this.results = res['data']

          this.show = this.results.length > 0 ? this.results[0]['show'] : false
          this.result = this.results.length > 0 ? this.results[0]['result'] : false

          this.results = lodash.chain(this.results)
            // Group the elements of Array based on `color` property
            .groupBy("coinid")
            // `key` is group's name (color), `value` is the array of objects
            .map((value, key) => ({ result: value[0]['result'], coinid: key, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: value[0]['percentage'], investamount: value[0]['sum'] / 100 }))
            .value()


          this.earnedAmount = this.result == true ? ((this.results.filter(a => a['percentage'] >= 0).reduce((s, d) => s + ((((d['investamount']) * d['percentage'] / 100))), 0) / 2) + this.results.filter(a => a['percentage'] < 0).reduce((s, d) => s + ((((d['investamount']) * d['percentage'] / 100))), 0)) : 0

        })


        this.http.post(baseUrl + '/getNoTradeShareResult', { userid: this.code, date: this.result_date }).subscribe((res) => {

          this.notradeOrders = res['data']
          // this.passOrders = res['data']

          // this.show = this.passOrders.length > 0 ? this.passOrders[0]['show'] : false
          this.result2 = this.notradeOrders.length > 0 ? this.notradeOrders[0]['result'] : false

          // this.passOrders = lodash.chain(this.passOrders)
          //   // Group the elements of Array based on `color` property
          //   .groupBy("coinid")
          //   // `key` is group's name (color), `value` is the array of objects
          //   .map((value, key) => ({ coinid: key, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: value[0]['percentage'], investamount: value[0]['sum'] / 100 }))
          //   .value()


          // console.log(this.passOrders)
          // this.earnedAmount = this.result == true ? ((this.passOrders.filter(a => a['percentage'] >= 0).reduce((s, d) => s + ((((d['investamount']) * d['percentage'] / 100))), 0) / 2) + this.passOrders.filter(a => a['percentage'] < 0).reduce((s, d) => s + ((((d['investamount']) * d['percentage'] / 100))), 0)) : 0


        })

      }

    })

  }

  returnShortNum(x) {
    return this.carPool.abbreviate(parseInt(x), 1, false, false)
  }

  tohome() {
    this.nav.navigateBack('home')
  }

  platformwidth() {
    return this.platform.width()
  }

  totalEarn() {
    return ((this.results.filter(a => a['percentage'] >= 0).reduce((s, d) => s + ((((d['investamount']) * d['percentage'] / 100))), 0) / 2) + this.results.filter(a => a['percentage'] < 0).reduce((s, d) => s + ((((d['investamount']) * d['percentage'] / 100))), 0))
  }

  toJournal() {
    this.nav.navigateForward('coinlist2?uid=' + this.code + '&date=' + this.result_date)
  }


  totalPercentage() {
    let totalInvestment = this.results.map(r => r['investamount']).reduce((a, b) => a + b, 0)
    let totalEarned = this.earnedAmount + totalInvestment
    return ((totalEarned - totalInvestment) / totalInvestment) * 100
  }

  returnWidth(x) {
    if (x >= 10) {
      return '100%'
    }

    return (x * 10) + '%'
  }


  returnWidth2(x) {
    x = -x
    if (x >= 10) {
      return '100%'
    }

    return (x * 10) + '%'
  }
}
