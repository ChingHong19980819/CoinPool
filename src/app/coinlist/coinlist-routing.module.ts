import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoinlistPage } from './coinlist.page';

const routes: Routes = [
  {
    path: '',
    component: CoinlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoinlistPageRoutingModule {}
