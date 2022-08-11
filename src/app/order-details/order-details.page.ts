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
import * as lodash from 'lodash'
import { PlaceorderPage } from '../placeorder/placeorder.page';

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
  currentUser = {}
  coinList = []
  passOrders = []
  start
  constructor(private nav: NavController,
    private http: HttpClient,
    private datePipe: DatePipe,
    private carpoolService: CarpoolService, private modal: ModalController) { }

  ngOnInit() {

    // console.log(this.roundTo(123.456, 2))
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })

        this.getOrders()
        this.http.post(baseUrl + '/getCoinList', {}).subscribe((a) => {
          this.coinList = a['data'].map(c => ({ ...c, amount: 0, percentage: 0, transactionid: user.uid + Date.now() + c['name'] }))
          this.selected['name'] = this.coinList[0]['name']
          this.selected['id'] = this.coinList[0]['id']
        })



      }
    })

  }

  async goplaceorder() {

    const modal = await this.modal.create({
      component: PlaceorderPage,
      cssClass: 'queueModal'
    });

    await modal.present();

    const data = await modal.onWillDismiss();
    console.log(data.data)
    if (data.data) {
      this.rangevalue = data.data / (this.currentUser['amount'] / 100) * 100
    }

    // this.nav.navigateForward('placeorder')
  }

  goorder() {

    this.nav.navigateBack('order')
  }

  test() {
    console.log(this.rangevalue);

  }


  back() {
    this.nav.pop()
  }

  toprofile() {
    this.nav.navigateForward('profile')
  }

  buyOrder() {
    let orderDetails = this.coinList.filter(c => c['amount'] > 0)

    if (orderDetails.length == 0) {
      this.carpoolService.showMessage('Please fill in all information!', '', 'error')
      return
    }

    if (orderDetails.reduce((a, b) => a + b['amount'], 0) > this.currentUser['amount']) {
      this.carpoolService.showMessage("You don't have enough credit to proceed!", '', 'error')
      return
    }

    this.carpoolService.swal_button('Confirmation', 'Do you want to proceed?', 'warning').then((ans) => {
      console.log(ans)
      if (ans == 'Confirm') {
        this.carpoolService.pleasewait('Please wait..', 'Submitting your application!')

        var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)
        let tradeInDate

        if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
          tradeInDate = cutOff
        } else {
          tradeInDate = new Date(cutOff).setDate(new Date(cutOff).getDate() - 1);
        }

        this.http.post(baseUrl + '/buyOrders', { orders: orderDetails.map(od => ({ transactionid: od['transactionid'], tradeindate: this.datePipe.transform(tradeInDate, 'dd-MM-yyyy'), coinid: od['id'], date: firebase.firestore.Timestamp.now().toMillis(), coin: od['name'], amount: this.roundTo(od['amount'], 2), userid: firebase.auth().currentUser.uid })) }).subscribe((res) => {
          this.carpoolService.swalclose()
          if (res['success'] == true) {
            // this.currentUser['amount'] -= this.selected.amount
            // this.getOrders()
            this.carpoolService.showMessage('Success', 'Your transaction is completed successfully', 'success')
            setTimeout(() => {
              this.nav.navigateRoot('home')
            }, 2000);
          }
          else {
            this.carpoolService.showMessage('Error', res['message'], 'error')
          }
        }, error => {
          this.carpoolService.swalclose()
        })
      }
    })


  }

  rangeChange(eve) {

    if (this.coinList.find(c => c['id'] == this.selected['id'])) {
      this.coinList.find(c => c['id'] == this.selected['id'])['percentage'] = eve.detail.value
      this.coinList.find(c => c['id'] == this.selected['id'])['amount'] = this.currentUser['amount'] * this.rangevalue / 100
      this.selected['amount'] = this.currentUser['amount'] * this.rangevalue / 100
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
    this.start;
    var end

    if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
      this.start = cutOff
      end = new Date(cutOff).setDate(new Date(cutOff).getDate() + 1);
    } else {
      this.start = new Date(cutOff).setDate(new Date(cutOff).getDate() - 1);
      end = cutOff
    }

    this.http.post(baseUrl + '/getOrdersByUid', { userid: firebase.auth().currentUser.uid, start: this.start, end: end, date: this.datePipe.transform(this.start, 'dd-MM-yyyy') }).subscribe((res) => {
      this.passOrders = res['data']

      this.passOrders = lodash.chain(this.passOrders)
        // Group the elements of Array based on `color` property
        .groupBy("coinid")
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ coinid: key, coinname: value[0]['coinname'], coinpicture: value[0]['coinpicture'], percentage: 2, investamount: value[0]['sum'] }))
        .value()
    })

  }

  sumAmount() {
    return this.roundTo(((this.coinList.reduce((a, b) => a + this.roundTo(b['amount'], 2), 0) || 0) / 100), 2)
  }


  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };



}
