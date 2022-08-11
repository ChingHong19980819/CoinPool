import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopupDetailsPageRoutingModule } from './topup-details-routing.module';

import { TopupDetailsPage } from './topup-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopupDetailsPageRoutingModule
  ],
  declarations: [TopupDetailsPage]
})
export class TopupDetailsPageModule {}
