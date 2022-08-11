import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';

@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.page.html',
  styleUrls: ['./placeorder.page.scss'],
})
export class PlaceorderPage implements OnInit {

  constructor(private nav: NavController, private http: HttpClient, private modal: ModalController) { }

  today = new Date().getTime()
  currentUser = {}
  amount

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
        })
      }
    })
  }

  back() {
    this.modal.dismiss()
  }

  toprofile() {

    this.nav.navigateForward('profile')
  }

  confirm() {
    this.modal.dismiss(this.amount)
  }
}
