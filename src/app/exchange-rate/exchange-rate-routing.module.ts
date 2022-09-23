import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeRatePage } from './exchange-rate.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangeRatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangeRatePageRoutingModule {}
