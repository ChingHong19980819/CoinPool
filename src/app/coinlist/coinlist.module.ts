import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoinlistPageRoutingModule } from './coinlist-routing.module';

import { CoinlistPage } from './coinlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoinlistPageRoutingModule
  ],
  declarations: [CoinlistPage]
})
export class CoinlistPageModule { }
