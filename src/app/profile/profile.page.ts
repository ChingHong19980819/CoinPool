import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private nav: NavController, private safariViewController: SafariViewController, private http: HttpClient, private carpoolService: CarpoolService, private outlet: IonRouterOutlet, private router: Router) { }

  currentUser = {}

  // lang = 'English'

  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["My Wallets"]: {
      Chinese: "我的钱包",
      English: "My Wallets",
    }, ["Refer Friends"]: {
      Chinese: "推荐好友",
      English: "Refer Friends",
    }, ["Help Center"]: {
      Chinese: "帮助中心",
      English: "Help Center",
    }, ["Privacy Policy"]: {
      Chinese: "隐私政策",
      English: "Privacy Policy",
    }, ["Account Verification"]: {
      Chinese: "帐户验证",
      English: "Account Verification",
    }, ["Guideline"]: {
      Chinese: "指南",
      English: "Guideline",
    }, ["Sign Out"]: {
      Chinese: "登出",
      English: "Sign Out",
    }, ["Result History"]: {
      Chinese: "历史成绩",
      English: "Result History",
    }, ["Profile"]: {
      Chinese: "个人主页",
      English: "Profile",
    }
  }





  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })
      }
    })

  }

  gowallet() {

    this.nav.navigateForward('mywallet')
  }

  gorefer() {

    this.nav.navigateForward('refer')
  }

  goverify() {

    this.nav.navigateForward('acc-verify')
  }

  goguide() {

    this.nav.navigateForward('guideline')
  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['home'], { replaceUrl: true });
  }

  goupdate() {
    this.nav.navigateForward('updateprofile')
  }

  golanguage() {

    this.nav.navigateForward('language')

  }

  gorecordhistory() {

    let holder = 'https://wa.me/60108879505?text=' + encodeURI('');

    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: holder,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
          })
            .subscribe((result: any) => {
              if (result.event === 'opened') console.log('Opened');
              else if (result.event === 'loaded') console.log('Loaded');
              else if (result.event === 'closed') console.log('Closed');
            },
              (error: any) => window.open(holder)
            );
        } else {
          window.open(holder);
        }
      }
      ).catch(a => {
        window.open(holder);
      });
  }

  goprivacy() {
    this.nav.navigateForward('privacy')

  }

  signout() {
    this.carpoolService.swal_button('Confirmation', 'Do you want to proceed?', 'warning').then((ans) => {
      if (ans == 'Confirm') {
        firebase.auth().signOut().then(() => {
          this.nav.navigateRoot('login')
        })
      }
    })
  }

  resulthistory() {
    this.nav.navigateForward('coinlist')
  }
}
