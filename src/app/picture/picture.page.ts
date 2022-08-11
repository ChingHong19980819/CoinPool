import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit {

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController) { }


  img;
  ngOnInit() {
    this.img = this.navParams.get('imgpath')
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
