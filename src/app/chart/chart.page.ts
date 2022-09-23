import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
declare var Chart
declare var luxon
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})
export class ChartPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private nav: NavController,
    private outlet: IonRouterOutlet, private router: Router
  ) { }

  chart;
  ctx = 'myChart2'
  barCount = 60;
  initialDateStr = '01 Apr 2017 00:00 Z';
  barData = this.getRandomData(this.initialDateStr, this.barCount);
  coin = ''
  currency = ''

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((a) => {
      this.coin = a['coin']
      this.currency = a['currency']
    })
  }

  ionViewDidEnter() {
    if (this.chart) {
      this.chart.destroy()
    }

    this.chart = new Chart(this.ctx, {
      type: 'candlestick',
      data: {
        datasets: [{
          data: this.barData
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }

    })
  }

  getRandomData(dateStr, count) {
    var date = luxon.DateTime.fromRFC2822(dateStr);
    var data = [this.randomBar(date, 30)];
    while (data.length < count) {
      date = date.plus({ days: 1 });
      if (date.weekday <= 5) {
        data.push(this.randomBar(date, data[data.length - 1].c));
      }
    }
    return data;
  }

  randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  randomBar(date, lastClose) {
    var open = +this.randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
    var close = +this.randomNumber(open * 0.95, open * 1.05).toFixed(2);
    var high = +this.randomNumber(Math.max(open, close), Math.max(open, close) * 1.1).toFixed(2);
    var low = +this.randomNumber(Math.min(open, close) * 0.9, Math.min(open, close)).toFixed(2);
    return {
      x: date.valueOf(),
      o: open,
      h: high,
      l: low,
      c: close
    };

  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['home'], { replaceUrl: true });
  }

}
