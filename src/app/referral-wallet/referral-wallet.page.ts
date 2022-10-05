import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { baseUrl } from 'src/environments/environment.prod';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NavController, IonRouterOutlet } from '@ionic/angular';
import { CarpoolService } from '../carpool.service';

@Component({
  selector: 'app-referral-wallet',
  templateUrl: './referral-wallet.page.html',
  styleUrls: ['./referral-wallet.page.scss'],
})
export class ReferralWalletPage implements OnInit {

  constructor(private nav: NavController, private datePipe: DatePipe, private http: HttpClient, private carPool: CarpoolService, private outlet: IonRouterOutlet, private router: Router) { }

  currentUser = {}

  logs = []

  langua = {
    ["My Referral Wallets"]: {
      Chinese: "我的推荐钱包",
      English: "My Referral Wallets",
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

  lang = localStorage.getItem('coinpool_language') || 'English'
  selectedDate

  ngOnInit() {

    this.selectedDate = new Date(new Date().setHours(0, 0, 0, 0))

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo2', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })

        this.http.post(baseUrl + '/getCommisionLogs', { uid: user.uid }).subscribe((res) => {
          this.logs = res['data']
          console.log(this.logs)
        })
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

}
