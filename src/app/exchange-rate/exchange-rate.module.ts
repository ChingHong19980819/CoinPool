import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangeRatePageRoutingModule } from './exchange-rate-routing.module';

import { ExchangeRatePage } from './exchange-rate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExchangeRatePageRoutingModule
  ],
  declarations: [ExchangeRatePage]
})
export class ExchangeRatePageModule {}
