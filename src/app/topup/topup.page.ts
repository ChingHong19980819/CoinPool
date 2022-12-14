import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

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

  constructor(private nav: NavController, private toastController: ToastController, private outlet: IonRouterOutlet, private router: Router, private carPool: CarpoolService, private http: HttpClient) { }

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
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['home'], { replaceUrl: true });
  }

  slideChanged(e: any) {
    this.slides.getActiveIndex().then((index: number) => {
      this.index = index
    });
  }


  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["Top up"]: {
      Chinese: "??????",
      English: "Top up",
    }, ["Credit Balance"]: {
      Chinese: "????????????",
      English: "Credit Balance",
    }, ["Custom Amount"]: {
      Chinese: "???????????????",
      English: "Custom Amount",
    },
    ["Choose the amount that you want to top up (minimum $100) or custom amount."]: {
      Chinese: "???????????????????????????????????? 100 ??????????????????????????????",
      English: "Choose the amount that you want to top up (minimum $100) or custom amount.",
    },
    ["Crypto platform charges a fee for transfer/withdrawal. Users must pay the service fee and transfer the correct amount selected in Coinpool."]: {
      Chinese: "????????????????????????/??????????????????????????????????????????????????????Coinpool???????????????????????????",
      English: "Crypto platform charges a fee for transfer/withdrawal. Users must pay the service fee and transfer the correct amount selected in Coinpool.",
    },
    ["We only accept"]: {
      Chinese: "???????????????",
      English: "We only accept",
    },
    ["Your top up request will be processed by admin in 48 hours."]: {
      Chinese: "??????????????? 48 ????????????????????????????????????",
      English: "Your top up request will be processed by admin in 48 hours.",
    },
    ["Please transfer to this USDT Account:"]: {
      Chinese: "????????????USDT?????????",
      English: "Please transfer to this USDT Account:",
    },
    ["Kindly transfer to the TRC20 address provided."]: {
      Chinese: "??????????????????TRC20?????????",
      English: "Kindly transfer to the TRC20 address provided.",
    },
    ["Warning"]: {
      Chinese: "??????",
      English: "Warning",
    },
    ["No refund if you transferto the wrong account."]: {
      Chinese: "???????????????????????????????????????????????????",
      English: "No refund if you transferto the wrong account.",
    }, ["COPY"]: {
      Chinese: "??????",
      English: "COPY",
    },
    ["Upload your bank transfer receipt photo"]: {
      Chinese: "????????????????????????????????????",
      English: "Upload your bank transfer receipt photo",
    }, ["Upload photo"]: {
      Chinese: "????????????",
      English: "Upload photo",
    },
    ["Top Up Amount"]: {
      Chinese: "????????????",
      English: "Top Up Amount",
    }, ["Submit"]: {
      Chinese: "??????",
      English: "Submit",
    },
  }
  // Top Up Amount

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

    if (this.invoiceDetails['amount'] < 100) {
      alert('Amount should greater than 100!')
      return
    }


    this.carPool.swal_button('Confirmation', 'Do you want to proceed?', 'warning').then((ans) => {

      // if(ans)

      if (ans == 'Confirm') {

        this.carPool.pleasewait('Please wait..', 'Submiting your application...')

        let arr = []
        if (this.invoiceDetails) {
          arr.push(new Promise((resolve, reject) => {
            this.carPool.pictureToLink(this.file, '').then((link) => {
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
              this.carPool.showMessage('Success', '', 'success')
              this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['home'], { replaceUrl: true });
            }

            // this.edit = false
          }, error => {
            this.carPool.swalclose()
          })
        })

      }



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
      const copyHotkey = isMac ? '???C' : 'CTRL+C';
      result = prompt(`Press ${copyHotkey}`, x); // eslint-disable-line no-alert
      if (!result) {
        return false;
      }
    }

    this.presentToast('Copied to clipboard!');

    return true;
  }

}
