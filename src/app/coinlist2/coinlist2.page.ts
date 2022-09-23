import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { baseUrl } from 'src/environments/environment.prod';
import * as cc from 'cryptocompare'

@Component({
  selector: 'app-coinlist2',
  templateUrl: './coinlist2.page.html',
  styleUrls: ['./coinlist2.page.scss'],
})

export class Coinlist2Page implements OnInit {

  coinList = []
  summaryResult = []

  constructor(
    private http: HttpClient,
    private nav: NavController,
    private outlet: IonRouterOutlet,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  code;
  result_date;

  ngOnInit() {

    cc.setApiKey('f5e033a36d80db094b3cf8414214f67a2fc84b4ff1c1010161cd7865955ae4ea')

    this.activatedRoute.queryParams.subscribe((a) => {
      if (a['uid'] && a['date']) {
        this.code = a['uid']
        this.result_date = a['date']
      }
    })


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
    this.outlet.canGoBack() ? this.nav.pop() : window.location.href = 'https://appcoinpool.web.app/share-result?uid=' + this.code + '&date=' + this.result_date;
  }

  godetails(coinid) {
    this.nav.navigateForward('calendar?id=' + coinid)
  }

}
