import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { PicturePage } from '../picture/picture.page';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.page.html',
  styleUrls: ['./result-list.page.scss'],
})
export class ResultListPage implements OnInit {

  constructor(private modalCtrl: ModalController, private outlet: IonRouterOutlet, private router: Router, private nav: NavController, private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  data: any = {}

  id;
  date;
  result
  showDate

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((a) => {
      this.id = a['id']
      this.date = a['date']
      this.showDate = this.date.replace('-', '.').replace('-', '.')

      firebase.auth().onAuthStateChanged((user) => {
        this.http.post(baseUrl + '/getResult2', { coinid: this.id, date: this.date, userid: user.uid }).subscribe((b) => {
          console.log(b)
          this.data = b['data']
        })
      })
    })
  }
  async goPicture(x) {
    const modal = await this.modalCtrl.create({
      component: PicturePage,
      componentProps: { imgpath: x }
    });

    await modal.present();
  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['result'], { replaceUrl: true });
  }

}
