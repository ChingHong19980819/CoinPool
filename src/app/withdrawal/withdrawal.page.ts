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

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.page.html',
  styleUrls: ['./withdrawal.page.scss'],
})
export class WithdrawalPage implements OnInit {

  select = 'new';
  application = {
    address: '',
    network: ''
  }

  addresses = []

  currentUser = {}

  constructor(private nav: NavController,
    private alertController: AlertController,
    public modal: ModalController,
    private http: HttpClient,
    private carPool: CarpoolService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })

        this.http.post(baseUrl + '/getAddress', { userid: user.uid }).subscribe((a) => {
          this.addresses = a['data'].map(asd => asd['address'])
        })

      }
    })
  }

  back() {
    this.nav.pop()
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

    if ((this.application['amount'] * 100) > this.currentUser['amount']) {
      alert('Exceed the limit!')
      return

    }

    this.carPool.swal_button('Please Confirm Your Withdraw Information', 'Address : ' + this.application['address'] + '\n\n' + 'Amount : RM' + this.application['amount'], 'warning').then((ans) => {
      console.log(ans)
      if (ans == 'Confirm') {

        this.carPool.pleasewait('Please wait..', 'Submiting your application...')

        this.http.post(baseUrl + '/newWithdraw', {
          address: this.application['address'],
          network: this.application['network'],
          amount: this.roundTo(this.application['amount'], 2),
          userid: firebase.auth().currentUser.uid
        }).subscribe((a) => {
          this.carPool.swalclose()

          if (a['success'] == true) {
            this.nav.navigateRoot('home')
            this.carPool.showMessage('Success', '', 'success')
          } else {
            this.carPool.showMessage('Fail', a['message'], 'error')
          }
          // this.edit = false
        }, error => {
          this.carPool.swalclose()
          console.log(error)
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
