import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.page.html',
  styleUrls: ['./topup.page.scss'],
})
export class TopupPage implements OnInit {

  @ViewChild('slides', { static: false }) slides: IonSlides;
  currentUser: any = {}
  select = 'USDT';
  currencies = []

  today = new Date().getTime()
  invoiceDetails: any = {}
  file;
  index = 0

  data: any = []

  constructor(private nav: NavController, private toastController: ToastController, private carPool: CarpoolService, private http: HttpClient) { }

  ngOnInit() {
    this.data = this.data.sort((a, b) => a['cash'] - b['cash'])
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        this.invoiceDetails['invoiceid'] = user.uid + Date.now()

        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })

        this.http.post(baseUrl + '/getCurrency', { userid: user.uid }).subscribe((a) => {
          this.currencies = a['data']
          console.log(this.currencies)
        })

        this.http.post(baseUrl + '/getTopUpPackage', { userid: user.uid }).subscribe((a) => {
          this.data = a['data']
        })


      }
    })
  }


  ionViewDidEnter() {
    this.slides.lockSwipes(true)
  }

  back() {
    this.nav.pop()
  }

  slideChanged(e: any) {
    this.slides.getActiveIndex().then((index: number) => {
      console.log(index);
      this.index = index
    });
  }

  godetails(x) {

    this.nav.navigateForward('topup-details?cash=' + x)
  }

  goprofile() {
    this.nav.navigateForward('profile')
  }

  topUp() {

    if (this.carPool.isNullOrEmpty(this.invoiceDetails, ['picture', 'amount'])) {
      alert('Everything must be filled up!')
      return
    }

    this.carPool.pleasewait('Please wait..', 'Submiting your application...')

    let arr = []
    if (this.invoiceDetails) {
      arr.push(new Promise((resolve, reject) => {
        this.carPool.pictureToLink(this.file, '').then((link) => {
          console.log(link)
          this.invoiceDetails['link'] = link['link']
          resolve(true)
        })
      }))
    }

    Promise.all(arr).then(() => {

      this.http.post(baseUrl + '/topUp', {
        amount: this.invoiceDetails['amount'],
        invoiceid: this.invoiceDetails['invoiceid'],
        currency: this.select,
        rate: this.returnRate(),
        credit: this.returnRate() * this.invoiceDetails['amount'],
        userid: firebase.auth().currentUser.uid,
        photo: this.invoiceDetails['link']
      }).subscribe((a) => {
        if (a['success'] == true) {
          this.carPool.swalclose()
          this.carPool.showMessage('Success', '', 'success')
          this.nav.pop()
        }

        // this.edit = false
      }, error => {
        this.carPool.swalclose()
      })
    })

  }

  uploadReceipt(event) {
    this.carPool.fileChange(event).then((image) => {
      this.invoiceDetails['picture'] = image['data']['image']
      this.file = image['data']['files']
    })
  }


  returnRate() {
    return ((this.currencies.find(x => x['currency'] == this.select) || {}).rate || 1)
  }

  nextStep(cash) {
    this.invoiceDetails['amount'] = cash
    this.slides.lockSwipes(false)
    this.slides.slideNext()
    this.slides.lockSwipes(true)
  }

  previousStep() {
    this.slides.lockSwipes(false)
    this.slides.slidePrev()
    this.slides.lockSwipes(true)
  }

  async presentToast(x) {
    const toast = await this.toastController.create({
      message: x,
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }

  copy2(x) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (x));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.presentToast('Copied to clipboard!');
  }

}
