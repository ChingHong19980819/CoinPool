import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { promise } from 'protractor';
import { baseUrl } from 'src/environments/environment.prod';
import * as moment from 'moment'
import { NavController, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private nav: NavController,
    private outlet: IonRouterOutlet,
    private router: Router
  ) { }

  coinId;
  summary;

  ngOnInit() {
  }

  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["Summary"]: {
      Chinese: "总结",
      English: "Summary",
    }, ["Result History"]: {
      Chinese: "历史成绩",
      English: "Result History",
    }
  }

  ionViewDidEnter() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.coinId = params['id']
      this.showCalendar(this.currentMonth, this.currentYear);
    })
  }

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  monthToShow = ''
  yearToShow = ''
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  dates = []
  results = []
  totalDown = 0;
  totalUp = 0;

  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.showCalendar(this.currentMonth, this.currentYear);
  }


  async showCalendar(month, year) {

    this.dates = []

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    this.monthToShow = this.months[month]
    this.yearToShow = year
    // console.log(this.monthToShow, this.yea)

    await this.getResult()
    let date: any = 1;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          this.dates.push('')
        }
        else if (date > daysInMonth) {
          break;
        }
        else {
          this.dates.push(this.returnTwoDigits(date))
          date++;
        }
      }
    }

    this.dates = this.dates.map(d => ({ date: d, percentage: d != '' ? ((this.results.filter(rs => rs['coinid'] == this.coinId).find(r => r['resultdate'].startsWith(d)) || {})['percentage'] || '') : '' }))
  }


  returnTwoDigits(x) {
    return (x.toString().length == 1 ? '0' : '') + x
  }

  getResult() {
    return new Promise((resolve, reject) => {
      this.http.post(baseUrl + '/getResultByMonth', { coinid: this.coinId, month: (this.returnTwoDigits(this.currentMonth + 1) + '-' + this.currentYear) }).subscribe((res) => {
        if (res['success'] == true) {
          this.results = res['data']
          this.totalUp = this.results.filter(rs => rs['percentage'] >= 0).length
          this.totalDown = this.results.filter(rs => rs['percentage'] < 0).length
          this.summary = this.results.reduce((h, l) => h + l['percentage'], 0)
          resolve(true)
        } else {
          this.results = []
          this.totalUp = this.results.filter(rs => rs['percentage'] >= 0).length
          this.totalDown = this.results.filter(rs => rs['percentage'] < 0).length
          this.summary = this.results.reduce((h, l) => h + l['percentage'], 0)
          resolve(true)
        }
      }, error => {
        this.results = []
        this.totalUp = this.results.filter(rs => rs['percentage'] >= 0).length
        this.totalDown = this.results.filter(rs => rs['percentage'] < 0).length
        this.summary = this.results.reduce((h, l) => h + l['percentage'], 0)
        resolve(true)
      })
    })

  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['coinlist'], { replaceUrl: true });
  }


}
