import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
})
export class UpdateprofilePage implements OnInit {

  constructor(private nav: NavController, private http: HttpClient, private carPool: CarpoolService) { }
  currentUser: any = {}

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
    this.nav.pop()
  }

  updateProfile() {
    this.carPool.pleasewait('Please wait..', 'Updating your profile')

    this.http.post(baseUrl + '/updateProfile', { name: this.currentUser.name, userid: firebase.auth().currentUser.uid }).subscribe((b) => {
      this.carPool.swalclose()
      this.carPool.showMessage('Update Successfully', '', 'success')
      this.nav.pop()
    })
  }
}
