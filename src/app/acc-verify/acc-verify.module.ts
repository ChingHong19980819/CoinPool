import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccVerifyPageRoutingModule } from './acc-verify-routing.module';

import { AccVerifyPage } from './acc-verify.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccVerifyPageRoutingModule
  ],
  declarations: [AccVerifyPage]
})
export class AccVerifyPageModule {}
