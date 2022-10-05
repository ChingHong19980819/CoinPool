import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CarpoolService } from '../carpool.service';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topup-details',
  templateUrl: './topup-details.page.html',
  styleUrls: ['./topup-details.page.scss'],
})
export class TopupDetailsPage implements OnInit {

  constructor(private nav: NavController, private outlet: IonRouterOutlet, private router: Router, public activatedroute: ActivatedRoute, private carPool: CarpoolService, private http: HttpClient, private sanitizer: DomSanitizer) { }

  topup = { amount: null }
  uid = ''
  invoiceDetails = {

  }

  ngOnInit() {

    this.activatedroute.queryParams.subscribe(a => {
      this.topup.amount = a['cash']
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.uid = user.uid
        }
      })
    })


  }

  back() {
    this.nav.pop()
  }

  goprofile() {
    this.nav.navigateForward('profile')
  }

  topUp() {
    if (this.carPool.isNullOrEmpty(this.invoiceDetails, ['description', 'gender', 'job', 'name'])) {
      alert('Everything must be filled up!')
      return
    }


    let arr = []
    if (this.invoiceDetails) {
      arr.push(new Promise((resolve, reject) => {
        this.carPool.pictureToLink(this.invoiceDetails['image'], this.invoiceDetails['uid']).then((link) => {
          this.invoiceDetails['picture'] = link['link']
          resolve(true)
        })
      }))
    }

    Promise.all(arr).then(() => {
      this.http.post(baseUrl + '/updateProfile', {
        uid: this.invoiceDetails['uid'], name: this.invoiceDetails['name']
      }).subscribe((a) => {
        // this.edit = false
      })
    })

  }

  uploadReceipt(event) {
    this.carPool.fileChange(event).then((image) => {
      this.invoiceDetails['picture'] = image['data']['image']
    })
  }

}
