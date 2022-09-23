import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { baseUrl } from 'src/environments/environment.prod';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.page.html',
  styleUrls: ['./exchange-rate.page.scss'],
})
export class ExchangeRatePage implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  currencies = []
  from;
  to;
  amount = 1

  ngOnInit() {
    this.http.post(baseUrl + '/getSymbols', {}).subscribe((res) => {
      this.currencies = res['data']
      this.from = 'USD'
      this.to = 'USD'
      // console.log(this.currencies.find(x => x['currency'] == 'USD'))
    })
  }

  returnExchangeRate() {
    let fromCurrency = this.currencies.find(b => b['currency'] == this.from)
    let toCurrency = this.currencies.find(b => b['currency'] == this.to)


    if (fromCurrency && toCurrency) {
      let usdAmount = this.amount / fromCurrency.rate
      return usdAmount * toCurrency.rate
    }

    return 0
  }

}
