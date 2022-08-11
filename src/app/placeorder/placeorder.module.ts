import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceorderPageRoutingModule } from './placeorder-routing.module';

import { PlaceorderPage } from './placeorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceorderPageRoutingModule
  ],
  declarations: [PlaceorderPage]
})
export class PlaceorderPageModule {}
