import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopupDetailsPage } from './topup-details.page';

const routes: Routes = [
  {
    path: '',
    component: TopupDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopupDetailsPageRoutingModule {}
