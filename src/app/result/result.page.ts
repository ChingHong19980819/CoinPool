import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { baseUrl } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import * as lodash from 'lodash'
import { CarpoolService } from '../carpool.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  currentUser = {}

  membership = [{ name: 'Bitcoin', name2: 'BTCUSD', current_value: '6.90', rates: '-3.85', picture: '/assets/icon/q.png', id: 1 },
  { name: 'Ethereum', name2: 'ETHUSD', current_value: '6.90', rates: '-3.56', picture: '/assets/icon/ethereum-eth-logo.png', id: 2 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '6.90', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  ]
  today = new Date().getTime()

  data = [{

  }]

  passOrders = []
  show = false
  selectedDate
  selectedDate2
  earnedAmount = 0;

  constructor(private nav: NavController, private carpoool: CarpoolService, private platform: Platform, private http: HttpClient, private datePipe: DatePipe, private socialSharing: SocialSharing) { }

  ngOnInit() {
    var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)

    if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
      this.selectedDate = this.datePipe.transform(cutOff, 'yyyy-MM-dd')
      this.selectedDate2 = this.datePipe.transform(cutOff, 'dd-MM-yyyy')
    } else {
      this.selectedDate = this.datePipe.transform(new Date(cutOff).setDate(new Date(cutOff).getDate() - 1), 'yyyy-MM-dd');
      this.selectedDate2 = this.datePipe.transform(new Date(cutOff).setDate(new Date(cutOff).getDate() - 1), 'dd-MM-yyyy');

    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
          console.log(this.currentUser)
        })

        this.getOrders()




      }
    })

  }

  back() {
    this.nav.pop()
  }

  toshare() {

    this.nav.navigateForward('share-result')
  }

  platformwidth() {
    // console.log(this.platform.width())
    return this.platform.width()
  }

  async shareLink() {

    let options = {
      message: "https://appcoinpool.web.app//share-result?uid=" + this.carpoool.encodeIds(this.currentUser['id']) + '&date=' + this.selectedDate2
    }

    console.log(options)

    this.socialSharing.shareWithOptions(options).then(async () => {
      // await this.loadingg.dismiss()
    }).catch(async (error) => {
      // await this.loadingg.dismiss()
      alert('Something went wrong! Please try it later!')
    })



  }


  getOrders() {

    this.passOrders = []
    var start = new Date(this.selectedDate).setHours(16, 0, 0, 0)
    var end = new Date(start).setDate(new Date(start).getDate() + 1);

    this.selectedDate2 = this.datePipe.transform(start, 'dd-MM-yyyy')

    this.http.post(baseUrl + '/getOrdersByUid', { userid: firebase.auth().currentUser.uid, start: start, end: end, date: this.datePipe.transform(start, 'dd-MM-yyyy') }).subscribe((res) => {
      this.passOrders = res['data']

      console.log(this.passOrders)

      this.show = this.passOrders.length > 0 ? this.passOrders[0]['show'] : false

      this.passOrders = lodash.chain(this.passOrders)
        // Group the elements of Array based on `color` property
        .groupBy("coinid")
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ coinid: key, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: value[0]['percentage'], investamount: value[0]['sum'] }))
        .value()


      this.earnedAmount = this.passOrders.reduce((s, d) => s + (((d['investamount'] / 100) * d['percentage'] / 100) / 2), 0)
      console.log()

    })
  }

  goDetails(coinid) {
    console.log(this.selectedDate2)
    console.log(coinid)
    this.nav.navigateForward('result-list?id=' + coinid + '&date=' + this.selectedDate2)
  }

  updateShow(eve) {
    console.log(eve.detail.checked)

    var start = new Date(this.selectedDate).setHours(16, 0, 0, 0)

    this.carpoool.pleasewait('Please wait..', 'Updating...')

    this.http.post(baseUrl + '/updateShow', { checked: eve.detail.checked, userid: firebase.auth().currentUser.uid, date: this.datePipe.transform(start, 'dd-MM-yyyy') }).subscribe((a) => {
      this.carpoool.swalclose()
    })
  }
}
