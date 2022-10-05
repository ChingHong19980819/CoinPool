import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ToastController } from '@ionic/angular';
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
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  currentUser: any = {}

  membership = [{ name: 'Bitcoin', name2: 'BTCUSD', current_value: '6.90', rates: '-3.85', picture: '/assets/icon/q.png', id: 1 },
  { name: 'Ethereum', name2: 'ETHUSD', current_value: '6.90', rates: '-3.56', picture: '/assets/icon/ethereum-eth-logo.png', id: 2 },
  { name: 'Doge Coin', name2: 'DOGEUSD', current_value: '6.90', rates: '-3.56', picture: '/assets/icon/dogecoin-doge-logo.png', id: 3 },
  ]
  today = new Date().getTime()

  data = [{

  }]

  passOrders = []
  show = false
  result = false
  result2 = false
  selectedDate
  earnedAmount = 0;
  notradeOrders;

  lang = localStorage.getItem('coinpool_language') || 'English'

  // 
  langua = {
    ["Result"]: {
      Chinese: "成绩",
      English: "Result",
    }, ["Watchlist"]: {
      Chinese: "观察名单",
      English: "Watchlist",
    }, ["Show Result"]: {
      Chinese: "显示成绩",
      English: "Show Result",
    }, ["Today Profit"]: {
      Chinese: "今日利润",
      English: "Today Profit",
    }, ["Available Balance"]: {
      Chinese: "可用余额",
      English: "Available Balance",
    }, ["Welcome"]: {
      Chinese: "欢迎",
      English: "Welcome",
    }, ["SILVER"]: {
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
    }
  }

  constructor(private nav: NavController, private outlet: IonRouterOutlet, private router: Router, private toastController: ToastController, private carpoool: CarpoolService, private platform: Platform, private http: HttpClient, private datePipe: DatePipe, private socialSharing: SocialSharing) { }

  ngOnInit() {
    var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis())

    this.selectedDate = this.datePipe.transform(cutOff, 'yyyy-MM-dd')

    // if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
    //   this.selectedDate = this.datePipe.transform(new Date(cutOff).setDate(new Date(cutOff).getDate() + 1), 'yyyy-MM-dd');
    // } else {
    //   this.selectedDate = this.datePipe.transform(cutOff, 'yyyy-MM-dd')
    // }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo2', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })

        this.getOrders()




      }
    })

  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['home'], { replaceUrl: true });
  }

  toshare() {

    this.nav.navigateForward('share-result')
  }

  platformwidth() {
    // console.log(this.platform.width())
    return this.platform.width()
  }

  returnShortNum(x) {
    return this.carpoool.abbreviate(parseInt(x), 1, false, false)
  }

  async shareLink() {

    let options = {
      message: "https://appcoinpool.web.app/share-result?uid=" + this.carpoool.encodeIds(this.currentUser['id']) + '&date=' + this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy')
    }

    this.socialSharing.shareWithOptions(options).then(async () => {
      // await this.loadingg.dismiss()
    }).catch(async (error) => {
      // await this.loadingg.dismiss()
      alert('Something went wrong! Please try it later!')
    })



  }


  getOrders() {

    this.passOrders = []
    let date = this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy')

    this.http.post(baseUrl + '/getOrdersByUid', { userid: firebase.auth().currentUser.uid, date: date }).subscribe((res) => {
      this.passOrders = res['data']

      this.show = this.passOrders.length > 0 ? this.passOrders[0]['show'] : false
      this.result = this.passOrders.length > 0 ? this.passOrders[0]['result'] : false

      this.passOrders = lodash.chain(this.passOrders)
        // Group the elements of Array based on `color` property
        .groupBy("coinid")
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ coinid: key, amount_eanred: value[0]['earned'] / 100, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: value[0]['percentage'], investamount: value[0]['sum'] / 100 }))
        .value()

      this.earnedAmount = this.result == true ? this.passOrders.reduce((s, d) => s + (d['amount_eanred'] - d['investamount']), 0) : 0


    })

    this.http.post(baseUrl + '/getNotTradeOrders', { userid: firebase.auth().currentUser.uid, date: date }).subscribe((res) => {

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

  goDetails(coinid) {
    this.nav.navigateForward('result-list?id=' + coinid + '&date=' + this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy'))
  }

  updateShow(eve) {
    var start = new Date(this.selectedDate).setHours(16, 0, 0, 0)

    this.carpoool.pleasewait('Please wait..', 'Updating...')

    this.http.post(baseUrl + '/updateShow', { checked: eve.detail.checked, userid: firebase.auth().currentUser.uid, date: this.datePipe.transform(start, 'dd-MM-yyyy') }).subscribe((a) => {
      this.carpoool.swalclose()
    })
  }

  async presentToast(x) {
    const toast = await this.toastController.create({
      message: x,
      position: 'bottom',
      duration: 2000,
      color: 'warning'
    });
    toast.present();
  }

  copyToClipboard(string) {
    string = "https://appcoinpool.web.app/share-result?uid=" + this.carpoool.encodeIds(this.currentUser['id']) + '&date=' + this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy')

    let textarea;
    let result;

    try {
      textarea = document.createElement('textarea');
      textarea.setAttribute('readonly', true);
      textarea.setAttribute('contenteditable', true);
      textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
      textarea.value = string;

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
      result = document.execCommand('copy');
    } catch (err) {
      console.error(err);
      result = null;
    } finally {
      document.body.removeChild(textarea);
    }

    // manual copy fallback using prompt
    if (!result) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
      result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
      if (!result) {
        return false;
      }
    }
    this.presentToast('Copied to clipboard!');

    return true;
  }

  copy2(x) {

    let textarea;
    let result;

    try {
      textarea = document.createElement('textarea');
      textarea.setAttribute('readonly', true);
      textarea.setAttribute('contenteditable', true);
      textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
      textarea.value = x;

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
      result = document.execCommand('copy');
    } catch (err) {
      console.error(err);
      result = null;
    } finally {
      document.body.removeChild(textarea);
    }

    // manual copy fallback using prompt
    if (!result) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
      result = prompt(`Press ${copyHotkey}`, x); // eslint-disable-line no-alert
      if (!result) {
        return false;
      }
    }

    this.presentToast('Copied to clipboard!');

    return true;
  }
}
