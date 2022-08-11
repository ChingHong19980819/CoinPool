import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { baseUrl } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReferGuard implements CanLoad {

  loadingAlert;


  constructor(private router: Router, private http: HttpClient, private loadingController: LoadingController, private nav: NavController) {

  }


  async canLoad(
    route: Route,

    segments: UrlSegment[]): Promise<boolean> {

    let params = this.router.getCurrentNavigation().extractedUrl.queryParams

    // await this.presentLoading('Please wait...')

    return new Promise(async (resolve) => {
      if (params['id']) {
        this.http.post(baseUrl + '/checkIfCodeCorrect', { code: params['code'] }).subscribe(async (res) => {
          if (res['success'] == true) {
            // await this.loadingAlert.dismiss()
            resolve(true)
          } else {
            // await this.loadingAlert.dismiss()
            this.nav.navigateRoot('referral')
            resolve(false)
          }
        }, async error => {
          // await this.loadingAlert.dismiss()
          this.nav.navigateRoot('referral')
          resolve(false)
        })

      } else {
        // await this.loadingAlert.dismiss()
        this.nav.navigateRoot('referral')
        resolve(false)
      }
    })
  }

  async presentLoading(msg) {
    this.loadingAlert = await this.loadingController.create({
      // cssClass: 'my-custom-class',
      message: msg,
    });

    await this.loadingAlert.present();
  }

  emailValidator(email) {
    if (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    } else {
      return false;
    }
  }


}
