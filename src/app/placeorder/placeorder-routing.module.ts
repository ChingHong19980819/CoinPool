import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceorderPage } from './placeorder.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceorderPageRoutingModule {}
