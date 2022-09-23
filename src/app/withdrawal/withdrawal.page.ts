import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { NetworkPage } from "../network/network.page";
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.page.html',
  styleUrls: ['./withdrawal.page.scss'],
})
export class WithdrawalPage implements OnInit {

  select = 'new';
  application: any = {
    address: '',
    network: ''
  }

  addresses = []

  currentUser: any = {}

  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["Withdrawal"]: {
      Chinese: "提款",
      English: "Withdrawal",
    }, ["*Your request will process within 48 hour"]: {
      Chinese: "*您的请求将在 48 小时内处理",
      English: "*Your request will process within 48 hour",
    }, ["*Withdrawal charges 6% of total amount"]: {
      Chinese: "*提款费为总金额的6%",
      English: "*Withdrawal charges 6% of total amount",
    }, ["Receive Amount"]: {
      Chinese: "收款金额",
      English: "Receive Amount",
    }, ["Available"]: {
      Chinese: "可提取金额",
      English: "Available",
    }, ["Max"]: {
      Chinese: "最大限度",
      English: "Max",
    }, ["Amount"]: {
      Chinese: "数额",
      English: "Amount",
    }, ["Withdraw"]: {
      Chinese: "提款",
      English: "Withdraw",
    }, ["Network"]: {
      Chinese: "网络",
      English: "Network",
    }, ["Select Address"]: {
      Chinese: "选择地址",
      English: "Select Address",
    }, ["Address"]: {
      Chinese: "地址",
      English: "Address",
    }, ["Address Book"]: {
      Chinese: "地址簿",
      English: "Address Book",
    }, ["New Address"]: {
      Chinese: "新地址",
      English: "New Address",
    }, ["Send USDT"]: {
      Chinese: "发送USDT",
      English: "Send USDT",
    }, ["Enter Address"]: {
      Chinese: "输入地址",
      English: "Enter Address",
    }, ["Select Network"]: {
      Chinese: "选择网络",
      English: "Select Network",
    }, ["Enter your amount"]: {
      Chinese: "输入您的金额",
      English: "Enter your amount",
    }

  }



  constructor(private nav: NavController,
    private alertController: AlertController,
    public modal: ModalController,
    private http: HttpClient,
    private outlet: IonRouterOutlet, private router: Router,
    private carPool: CarpoolService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })

        this.http.post(baseUrl + '/getAddress', { userid: user.uid }).subscribe((a) => {
          this.addresses = a['data'].map(asd => asd['address'])
          this.addresses = ['123', '321']
        })

      }
    })
  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['mywallet'], { replaceUrl: true });
  }

  async tonetwork() {
    const modal = await this.modal.create({
      cssClass: 'network',
      component: NetworkPage,
      backdropDismiss: false
    });

    await modal.present();


    const { data } = await modal.onWillDismiss();

    if (data) {
      this.application['network'] = data
      // console.log(data)
    }

  }

  newWithdraw() {
    if (this.carPool.isNullOrEmpty(this.application, ['network', 'address', 'amount'])) {
      alert('Everything must be filled up!')
      return
    }

    if ((this.application['amount'] * 100) <= 0) {
      alert('Amount should greater than 0!')
      return
    }

    if ((this.application['amount'] * 100) > this.currentUser['amount']) {
      alert('Exceed the limit!')
      return
    }

    this.carPool.swal_button('Please Confirm Your Withdraw Information', 'Address : ' + this.application['address'] + '\n\n' + 'Amount : ' + this.application['amount'] + ' USDT', 'warning').then((ans) => {
      if (ans == 'Confirm') {

        this.carPool.pleasewait('Please wait..', 'Submiting your application...')

        this.http.post(baseUrl + '/newWithdraw', {
          address: this.application['address'],
          network: this.application['network'],
          amount: this.roundTo(this.application['amount'], 2),
          userid: firebase.auth().currentUser.uid
        }).subscribe((a) => {

          if (a['success'] == true) {
            this.nav.navigateRoot('home')

            setTimeout(() => {
              this.carPool.showMessage('Success', '', 'success')

            }, 0);


          } else {
            this.carPool.showMessage('Fail', a['message'], 'error')
          }
          // this.edit = false
        }, error => {
          this.carPool.swalclose()
        })

      }

    })



  }

  async onClick() {
    let something: any = this.addresses.length > 0 ? this.addresses.map((ad) => ({ label: ad, type: 'radio', value: ad })) : []
    const alert = await this.alertController.create({
      header: 'Select your address',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (a) => {
            this.application['address'] = a
          },
        },
      ],
      inputs: something,
    });

    await alert.present();
  }

  maxwith() {
    this.application['amount'] = this.currentUser['amount'] / 100
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };


}
