import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Coinlist2Page } from './coinlist2.page';

const routes: Routes = [
  {
    path: '',
    component: Coinlist2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Coinlist2PageRoutingModule {}
