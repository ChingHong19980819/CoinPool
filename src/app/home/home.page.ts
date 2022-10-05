import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore'
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import ColorGenerator from "random-color-array-generator/ColorGenerator.min.js";
import { CarpoolService } from '../carpool.service';
import * as cc from 'cryptocompare'
import { ActivatedRoute } from '@angular/router';
declare var Chart

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  today = new Date().getTime();
  slides = [] as any;
  interval
  currentUser: any = {}
  chart;


  time = [
    { time: '6/24/2022' },
    { time: '7/24/2022' },
    { time: '8/24/2022' },
    { time: '9/24/2022' },
  ];

  membership = [
    {
      name: 'Bitcoin',
      name2: 'BTCUSD',
      current_value: 38965.2,
      rates: '-3.85',
      picture: '/assets/icon/q.png',
      id: 1,
    },
    {
      name: 'Ethereum',
      name2: 'ETHUSD',
      current_value: 38965.2,
      rates: '-3.56',
      picture: '/assets/icon/ethereum-eth-logo.png',
      id: 2,
    },
    {
      name: 'Doge Coin',
      name2: 'DOGEUSD',
      current_value: 38965.2,
      rates: '-3.56',
      picture: '/assets/icon/dogecoin-doge-logo.png',
      id: 3,
    },
  ];

  ctx = 'myChart';
  coinList = []
  totalSelfInvestment = 0
  totalInvestment = 0
  chartInfo = []
  selectedDate

  // lang = 'English'

  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["Hello"]: {
      Chinese: "你好",
      English: "Hello",
    }, ["Your Available Balance"]: {
      Chinese: "您的可用余额？",
      English: "Your Available Balance",
    }, ["Total invested"]: {
      Chinese: "总投资",
      English: "Total invested",
    }, ["Top up"]: {
      Chinese: "充值",
      English: "Top up",
    }, ["Place Order"]: {
      Chinese: "下订单",
      English: "Place Order",
    }, ["Result"]: {
      Chinese: "成绩",
      English: "Result",
    }, ["Hour"]: {
      Chinese: "小时",
      English: "Hour",
    }, ["Minutes"]: {
      Chinese: "分钟",
      English: "Minutes",
    }, ["Sec"]: {
      Chinese: "秒",
      English: "Sec",
    }, ["Total Pool Funds"]: {
      Chinese: "资金池",
      English: "Total Pool Funds",
    }, ["Daily Pool"]: {
      Chinese: "每日资金池",
      English: "Daily Pool",
    },


  }

  news = [] as any
  newactivate = false
  level = 'low'


  constructor(private nav: NavController,
    private acctivatedRoute: ActivatedRoute,
    private platform: Platform, private datePipe: DatePipe, private http: HttpClient, private carpoolService: CarpoolService) { }

  ngOnInit() {
    cc.setApiKey('f5e033a36d80db094b3cf8414214f67a2fc84b4ff1c1010161cd7865955ae4ea')

    let arr = [1, 2, 3, 4, 5, 5, 7, 8, 8, 10, 11, 12, 13]

    let positivenegative = ''
    let number = 0;
    let toPutColumns = 0

    for (let rows = 0; rows < 2; rows++) {
      for (let columns = 0; columns < 7; columns++) {
        let currentValue = arr[columns + (rows * 7)]
        if (currentValue) {

          if (columns + (rows * 7) == 0) {
            positivenegative = currentValue > 0 ? 'positive' : 'negative'
          }

          let newPositivenegative = currentValue > 0 ? 'positive' : 'negative'

          number++

          if (positivenegative != newPositivenegative) {
            positivenegative = newPositivenegative
            number = 0
            toPutColumns++
          }

          // console.log(number)

          if (number > 6) {
            console.log((((number - 6) + 1) * 7) - 1)
          } else {
            console.log(number)
          }

          // console.log(toPutColumns, 'nooo')

        }
      }
    }

    // this.lang = !localStorage.getItem('language') ? 'English' : localStorage.getItem('language')

    var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)

    if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
      this.selectedDate = this.datePipe.transform(new Date(cutOff).setDate(new Date(cutOff).getDate() + 1), 'yyyy-MM-dd');
    } else {
      this.selectedDate = this.datePipe.transform(cutOff, 'yyyy-MM-dd')
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.acctivatedRoute.queryParams.subscribe((a) => {

        })

        this.carpoolService.pleasewait('Please wait..', 'Getting your data..')
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
          this.carpoolService.swalclose()
        })


        this.getChartData()

        this.http.post(baseUrl + '/totalInvestment', { userid: user.uid, date: this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy') }).subscribe((res) => {
          this.totalSelfInvestment = res['data']
        })


        this.http.post(baseUrl + '/getCoinList', { userid: user.uid }).subscribe((a) => {
          this.coinList = a['data'].sort((v, d) => v['orders'] - d['orders'])
          cc.priceMulti(this.coinList.map(cl => cl['crypto']), [...new Set(this.coinList.map(cl => cl['currency']))])
            .then(prices => {
              this.coinList = this.coinList.map(cl => ({ ...cl, current_value: prices[cl['crypto']]['USD'] }))
            })
          this.updateCoin()
        })

      }
    })

    // this.http.get(baseUrl + '/usergetannouncement').subscribe((res) => {

    //   // console.log(res)
    //   this.news = res['data']

    //   if(this.lengthof(this.news)){

    //     this.newactivate = true

    //   }

    //   console.log(this.news)

    // })

  }

  lengthof(x) {

    return Object.values(x || {}).length

  }

  ionViewDidEnter() {
    this.resultCountDown()
  }

  gotopup() {
    this.nav.navigateForward('topup');
  }

  goorder() {
    this.nav.navigateForward('order');
  }

  goresult() {
    this.nav.navigateForward('result');
  }

  goprofile() {
    this.nav.navigateForward('profile');
  }

  platformwidth() {
    // console.log(this.platform.width())
    return this.platform.width();
  }

  back() { }

  godetails(eve) {

  }

  resultCountDown() {
    // Update the count down every 1 second
    this.interval = setInterval(() => {
      var countDownDate = new Date().setHours(20, 0, 0, 0)

      if (parseInt(this.datePipe.transform(Date.now(), 'HHmmss')) >= 200000) {
        countDownDate = new Date(countDownDate).setDate(new Date(countDownDate).getDate() + 1);
      }

      var now = Date.now()
      var distance = countDownDate - now;

      let hourChange = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()
      let minChange = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()
      let secChange = Math.floor((distance % (1000 * 60)) / 1000).toString()
      document.getElementById("hours").innerText = (hourChange.length == 1 ? '0' : '') + hourChange
      document.getElementById("minutes").innerText = (minChange.length == 1 ? '0' : '') + minChange
      document.getElementById("seconds").innerText = (secChange.length == 1 ? '0' : '') + secChange


    }, 1000);
  }

  ionViewWillLeave() {
    clearInterval(this.interval)
  }

  getChartData() {

    this.carpoolService.pleasewait('Please wait.....', 'Generating data...')

    let date = this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy')

    this.http.post(baseUrl + '/getOrdersDailyChart', { date: date }).subscribe((res) => {
      this.carpoolService.swalclose()
      this.chartInfo = res['data'].filter(r => r['level'] == this.level)

      this.totalInvestment = this.chartInfo.reduce((a, b) => a + b['sum'], 0)

      this.chartInfo = this.chartInfo.map((value, index) => ({ ...value, percentage: ((value.sum / this.totalInvestment) * 100) }))

      if (this.chart) {
        this.chart.destroy()
      }

      this.chart = new Chart(this.ctx, {
        type: 'doughnut',
        data: {
          // labels: ['Red', 'Blue', 'Yellow', 'Green'],
          // 'Purple', 'Orange'
          datasets: [
            {
              label: '# of Votes',
              data: this.chartInfo.length > 0 ? this.chartInfo.map(c => c['sum'] / 100) : [1],
              backgroundColor: this.chartInfo.length > 0 ? this.chartInfo.map(c => c['color']) : ['#fffcfc'],
              borderColor: [
                '#666666',
                // 'rgba(54, 162, 235, 1)',
                // 'rgba(255, 206, 86, 1)',
                // 'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          cutout: '70%',
        },
      });
    }, error => {
      this.carpoolService.swalclose()

    })
  }

  updateCoin() {
    setInterval(() => {
      cc.priceMulti(this.coinList.map(cl => cl['crypto']), [...new Set(this.coinList.map(cl => cl['currency']))])
        .then(prices => {
          this.coinList = this.coinList.map(cl => ({ ...cl, current_value: prices[cl['crypto']]['USD'] }))
        })
    }, 3000)
  }


  doRefresh(event) {
    this.ngOnInit()

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
