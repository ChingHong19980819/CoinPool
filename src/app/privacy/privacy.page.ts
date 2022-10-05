import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {

  constructor(
    private nav: NavController,
    private outlet: IonRouterOutlet, private router: Router
  ) { }

  ngOnInit() {
  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['profile'], { replaceUrl: true });
  }

}
