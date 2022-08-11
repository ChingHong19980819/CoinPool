import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.page.html',
  styleUrls: ['./refer.page.scss'],
})
export class ReferPage implements OnInit {


  data = [{ name: 'Ferry', date: '01 May 22. 15.43 joined' },
  { name: 'Jerry', date: '05 May 22. 15.43 joined' },
  { name: 'Gary', date: '07 May 22. 15.43 joined' },
  { name: 'Barry', date: '18 May 22. 15.43 joined' },
  { name: 'Larry', date: '25 May 22. 15.43 joined' }]

  currentUser = {}
  referralList = []

  constructor(private nav: NavController,
    private datePipe: DatePipe,
    private http: HttpClient,
    private carpoolService: CarpoolService,
    private socialSharing: SocialSharing,
    private toastController: ToastController) { }

  referralCode = ''
  selectedDate;

  ngOnInit() {

    var cutOff = new Date(firebase.firestore.Timestamp.now().toMillis()).setHours(16, 0, 0, 0)

    if (parseInt(this.datePipe.transform(firebase.firestore.Timestamp.now().toMillis(), 'HHmmss')) >= 160000) {
      this.selectedDate = this.datePipe.transform(cutOff, 'dd-MM-yyyy')
    } else {
      this.selectedDate = this.datePipe.transform(new Date(cutOff).setDate(new Date(cutOff).getDate() - 1), 'dd-MM-yyyy');
    }


    console.log(this.selectedDate)

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
          this.referralCode = this.carpoolService.encodeIds(parseInt(this.currentUser['id']))

        })

        this.http.post(baseUrl + '/getReferralList', { userid: user.uid, date: this.selectedDate }).subscribe((a) => {
          this.referralList = a['data']
          console.log(this.referralList)
        })
      }
    })
  }

  back() {
    this.nav.pop()
  }

  async shareLink() {

    console.log("https://appcoinpool.web.app/signup?code=" + this.referralCode)

    let options = {
      message: "https://appcoinpool.web.app/signup?code=" + this.referralCode
      // url: 'https://www.website.com/foo/#bar?a=b'
    }
    this.socialSharing.shareWithOptions(options).then(async () => {
      // await this.loadingg.dismiss()
    }).catch(async (error) => {
      // await this.loadingg.dismiss()
      alert('Something went wrong! Please try it later!')
    })

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
