import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';

import { baseUrl } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CarpoolService } from '../carpool.service';
import { PlaceorderPage } from '../placeorder/placeorder.page';
import { IonRouterOutlet } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  membership = []
  today = new Date().getTime()
  selected = { name: 'Bitcoin' } as any;
  balls = ['', '', '', '']
  rangevalue = [] as any;
  currentUser: any = {}
  coinList = []
  start
  interval4
  orderCountDownDate
  maxValue = 100
  totalUp = 0
  totalDown = 0
  coinId;
  summary;

  picture;

  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["Summary"]: {
      Chinese: "总结",
      English: "Summary",
    }, ["Custom Amount"]: {
      Chinese: "自定义金额",
      English: "Custom Amount",
    }, ["Min"]: {
      Chinese: "最低金额",
      English: "Min",
    }, ["Total"]: {
      Chinese: "总数",
      English: "Total",
    }, ["Available Balance"]: {
      Chinese: "可用额度",
      English: "Available Balance",
    }, ["Place Order"]: {
      Chinese: "下单",
      English: "Place Order",
    }
  }

  type;

  level = {
    'low': 'x5 Leverage',
    'high': 'x50 Leverage'
  }

  constructor(private nav: NavController,
    private http: HttpClient,
    private datePipe: DatePipe,
    private outlet: IonRouterOutlet,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private carpoolService: CarpoolService, private modal: ModalController) { }


  news = []

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  show = true;

  ngOnInit() {

    // console.log(this.roundTo(123.456, 2))
    this.lastOrderCountDown()

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })

        this.activatedRoute.queryParams.subscribe((params) => {
          this.type = params['level']
          this.show = this.type == 'high'
          this.coinId = params['id']

          this.http.get(baseUrl + '/usergetannouncement').subscribe((res) => {
            this.news = res['data']
          })

          this.http.post(baseUrl + '/getCoinList', {}).subscribe((a) => {
            this.coinList = a['data'].filter(d => d['id'] == this.coinId)
            this.selected['name'] = this.coinList[0]['name']
            this.picture = this.coinList[0]['picture']
            this.selected['id'] = this.coinList[0]['id']
            this.selected['transactionid'] = user.uid + Date.now() + this.coinList[0]['name']
          })

          this.showCalendar(this.currentMonth, this.currentYear);

        })


        this.getOrders()




      }
    })

  }

  amount

  async goplaceorder() {

    const modal = await this.modal.create({
      component: PlaceorderPage,
      cssClass: 'queueModal'
    });

    await modal.present();

    const data = await modal.onWillDismiss();
    if (data.data) {
      this.rangevalue = data.data / (this.currentUser['amount'] / 100) * 100
    }

    // this.nav.navigateForward('placeorder')
  }

  goorder() {

    this.nav.navigateBack('order')
  }

  test() {

  }


  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['order'], { replaceUrl: true });
  }

  toprofile() {
    this.nav.navigateForward('profile')
  }

  buyOrder() {

    if (this.amount == 0) {
      this.carpoolService.showMessage('Please fill in all information!', '', 'error')
      return
    }

    if ((this.amount * 100) > this.currentUser['amount']) {
      this.carpoolService.showMessage("You don't have enough credit to proceed!", '', 'error')
      return
    }


    if ((this.amount * 100) < 10000) {
      this.carpoolService.showMessage("The minimun place order amount is 100!", '', 'error')
      return
    }


    this.carpoolService.swal_button('Confirmation', 'Do you want to proceed?', 'warning').then((ans) => {
      if (ans == 'Confirm') {
        this.carpoolService.pleasewait('Please wait..', 'Submitting your application!')

        var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)
        let tradeInDate

        if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
          tradeInDate = new Date(cutOff).setDate(new Date(cutOff).getDate() + 1);
        } else {
          tradeInDate = cutOff
        }

        this.http.post(baseUrl + '/buyOrders', { orders: [{ transactionid: this.selected['transactionid'], tradeindate: this.datePipe.transform(tradeInDate, 'dd-MM-yyyy'), coinid: this.coinId, date: firebase.firestore.Timestamp.now().toMillis(), coin: this.selected['name'], amount: (this.roundTo(this.amount, 2) * 100), userid: firebase.auth().currentUser.uid, level: this.type }] }).subscribe((res) => {
          this.carpoolService.swalclose()
          if (res['success'] == true) {
            // this.currentUser['amount'] -= this.selected.amount
            // this.getOrders()
            setTimeout(() => {
              this.carpoolService.showMessage('Success', 'Your transaction is completed successfully', 'success')
              this.nav.navigateRoot('home')
            }, 0);
          }
          else {
            setTimeout(() => {
              this.carpoolService.showMessage('Error', res['message'], 'error')
            }, 0)
          }
        }, error => {
          setTimeout(() => {
            this.carpoolService.swalclose()
          }, 0)
        })
      }
    })


  }

  rangeChange(eve) {
    this.amount = this.roundTo((((this.currentUser['amount'] / 100) * eve.detail.value) / 100), 2)
    // if (this.coinList.find(c => c['id'] == this.selected['id'])) {
    //   this.coinList.find(c => c['id'] == this.selected['id'])['percentage'] = eve.detail.value
    //   this.coinList.find(c => c['id'] == this.selected['id'])['amount'] = this.roundTo((this.currentUser['amount'] * this.rangevalue / 100), 2)
    //   this.selected['amount'] = this.roundTo((this.currentUser['amount'] * this.rangevalue / 100), 2)
    // }
  }


  changePercentage(e) {
    if ((e.detail.value) > (this.currentUser['amount']) / 100) {
      this.amount = 0;
      setTimeout(() => {
        this.amount = (this.currentUser['amount']) / 100;
        this.rangevalue = this.amount / (this.currentUser['amount'] / 100) * 100
      }, 1);
    } else {
      this.rangevalue = this.amount / (this.currentUser['amount'] / 100) * 100
    }
  }

  changeCoin(selected) {
    this.selected.name = selected.name;
    this.selected.id = selected.id
    this.selected['amount'] = this.coinList.find(c => c['id'] == this.selected['id'])['amount'] || 0
    this.rangevalue = this.selected['amount'] / this.currentUser['amount'] * 100
  }

  getOrders() {

    var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)
    var date

    if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
      date = this.datePipe.transform(new Date(cutOff).setDate(new Date(cutOff).getDate() + 1), 'dd-MM-yyyy')
    } else {
      date = this.datePipe.transform(new Date(cutOff), 'dd-MM-yyyy')
    }

  }

  sumAmount() {
    return this.roundTo(((this.coinList.reduce((a, b) => a + this.roundTo(b['amount'], 2), 0) || 0) / 100), 2)
  }


  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  lastOrderCountDown() {
    // Update the count down every 1 second
    this.interval4 = setInterval(() => {
      this.orderCountDownDate = new Date().setHours(16, 0, 0, 0)

      if (parseInt(this.datePipe.transform(Date.now(), 'HHmmss')) >= 160000) {
        this.orderCountDownDate = new Date(this.orderCountDownDate).setDate(new Date(this.orderCountDownDate).getDate() + 1);
      }

    }, 1000);
  }

  ionViewWillLeave() {
    clearInterval(this.interval4)
  }


  ionViewDidEnter() {

  }

  today2 = new Date();
  currentMonth = this.today2.getMonth();
  currentYear = this.today2.getFullYear();
  monthToShow = ''
  yearToShow = ''
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  dates = []
  results = []

  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.showCalendar(this.currentMonth, this.currentYear);
  }


  async showCalendar(month, year) {

    this.dates = []

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    this.monthToShow = this.months[month]
    this.yearToShow = year
    // console.log(this.monthToShow, this.yea)

    await this.getResult()
    let date: any = 1;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          this.dates.push('')
        }
        else if (date > daysInMonth) {
          break;
        }
        else {
          this.dates.push(this.returnTwoDigits(date))
          date++;
        }
      }
    }

    this.dates = this.dates.map(d => ({ date: d, percentage: d != '' ? ((this.results.filter(rs => rs['coinid'] == this.coinId).find(r => r['resultdate'].startsWith(d)) || {})['percentage'] || '') : '' }))
  }


  returnTwoDigits(x) {
    return (x.toString().length == 1 ? '0' : '') + x
  }

  getResult() {
    return new Promise((resolve, reject) => {
      console.log({ level: this.type, coinid: this.coinId, month: (this.returnTwoDigits(this.currentMonth + 1) + '-' + this.currentYear) })
      this.http.post(baseUrl + '/getResultByMonth', { level: this.type, coinid: this.coinId, month: (this.returnTwoDigits(this.currentMonth + 1) + '-' + this.currentYear) }).subscribe((res) => {
        if (res['success'] == true) {
          this.results = res['data']
          this.totalUp = this.results.filter(rs => rs['percentage'] >= 0).length
          this.totalDown = this.results.filter(rs => rs['percentage'] < 0).length

          this.summary = this.results.reduce((h, l) => h + l['percentage'], 0)
          resolve(true)
        } else {
          this.results = []
          this.totalUp = this.results.filter(rs => rs['percentage'] >= 0).length
          this.totalDown = this.results.filter(rs => rs['percentage'] < 0).length
          this.summary = this.results.reduce((h, l) => h + l['percentage'], 0)
          resolve(true)
        }
      }, error => {
        this.results = []
        this.totalUp = this.results.filter(rs => rs['percentage'] >= 0).length
        this.totalDown = this.results.filter(rs => rs['percentage'] < 0).length
        this.summary = this.results.reduce((h, l) => h + l['percentage'], 0)
        resolve(true)
      })
    })

  }

}
