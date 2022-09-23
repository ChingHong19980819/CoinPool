import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { baseUrl } from 'src/environments/environment.prod';
import * as cc from 'cryptocompare'

@Component({
  selector: 'app-coinlist',
  templateUrl: './coinlist.page.html',
  styleUrls: ['./coinlist.page.scss'],
})
export class CoinlistPage implements OnInit {

  coinList = []
  summaryResult = []

  constructor(
    private http: HttpClient,
    private nav: NavController,
    private outlet: IonRouterOutlet,
    private router: Router
  ) { }

  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["Coin List"]: {
      Chinese: "硬币清单",
      English: "Coin List",
    }, ["Result History"]: {
      Chinese: "历史成绩",
      English: "Result History",
    }
  }

  ngOnInit() {

    cc.setApiKey('f5e033a36d80db094b3cf8414214f67a2fc84b4ff1c1010161cd7865955ae4ea')


    this.http.post(baseUrl + '/getCoinList', {}).subscribe((a) => {
      this.coinList = a['data'].sort((v, d) => v['orders'] - d['orders'])
      cc.priceMulti(this.coinList.map(cl => cl['crypto']), [...new Set(this.coinList.map(cl => cl['currency']))])
        .then(prices => {
          this.coinList = this.coinList.map(cl => ({ ...cl, current_value: prices[cl['crypto']]['USD'] }))
        })
    })

    this.http.post(baseUrl + '/getSummaryResult', {}).subscribe((a) => {
      this.summaryResult = a['data']
    })
  }


  summaryById(coinid) {
    return ((this.summaryResult.find(x => x['coinid'] == coinid) || {}).percentage || 0)
  }

  goprofile() {
    this.nav.navigateForward('profile')
  }



  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['profile'], { replaceUrl: true });
  }


  godetails(coinid) {
    this.nav.navigateForward('calendar?id=' + coinid)
  }

}
