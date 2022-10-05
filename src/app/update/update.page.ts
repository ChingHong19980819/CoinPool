import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Market } from '@ionic-native/market/ngx';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  marketid;

  constructor(public modalCtrl: ModalController, private market: Market, private navParams: NavParams) { }
  ngOnInit() {
    this.marketid = this.navParams.get('marketid')
  }

  close() {
    this.modalCtrl.dismiss()
  }

  openMarket() {
    this.market.open(this.marketid)
  }

}
