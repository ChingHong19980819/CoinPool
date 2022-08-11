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
  code = ''
  show = false
  showDate;

  constructor(private nav: NavController, private platform: Platform, private http: HttpClient, private activatedRoute: ActivatedRoute,
    private carPool: CarpoolService) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((a) => {
      if (a['uid'] && a['date']) {
        this.code = a['uid']
        this.result_date = a['date']
        this.showDate = this.result_date.split('-')[0] + '.' + this.result_date.split('-')[1] + '.' + this.result_date.split('-')[2]
        console.log(this.showDate)
        this.http.post(baseUrl + '/getUserInfoByUid', { userid: this.code }).subscribe((a) => {
          this.currentUser = a['data'] || {}
        })


        this.http.post(baseUrl + '/getResultByDate', { tradeindate: this.result_date, userid: this.code }).subscribe((a) => {
          this.results = a['data']

          this.show = a['data'].length > 0 ? a['data'][0]['show'] : false
          this.results = lodash.chain(this.results)
            // Group the elements of Array based on `color` property
            .groupBy("coinid")
            // `key` is group's name (color), `value` is the array of objects
            .map((value, key) => ({
              coinid: key, name: value[0]['name'], picture: value[0]['picture'], percentage: value[0]['percentage'],
              investamount: value.reduce((x, y) => x + y['amount'], 0), amount_earned: value.reduce((x, y) => x + y['amount_earned'], 0),
              amount_charged: value.reduce((x, y) => x + y['amount_charged'], 0)
            }))
            .value()

          console.log(this.results)
        })

      }

    })

  }

  tohome() {
    this.nav.navigateBack('home')
  }

  platformwidth() {
    return this.platform.width()
  }

  totalEarn() {
    return this.results.reduce((a, b) => a + (b['amount_earned'] + b['amount_charged']), 0) || 0
  }


  totalPercentage() {
    return (this.results.reduce((a, b) => a + (b['amount_earned'] + b['amount_charged']), 0) || 0) / (this.results.reduce((a, b) => a + (b['investamount']), 0) || 1) * 100
  }

  returnWidth(x) {
    return x + '%'
  }
}
