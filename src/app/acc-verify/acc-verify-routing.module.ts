import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccVerifyPage } from './acc-verify.page';

const routes: Routes = [
  {
    path: '',
    component: AccVerifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccVerifyPageRoutingModule {}
