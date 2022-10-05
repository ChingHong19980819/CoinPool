import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Coinlist2PageRoutingModule } from './coinlist2-routing.module';

import { Coinlist2Page } from './coinlist2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Coinlist2PageRoutingModule
  ],
  declarations: [Coinlist2Page]
})
export class Coinlist2PageModule {}
