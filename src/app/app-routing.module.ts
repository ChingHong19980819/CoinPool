import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'acc-verify',
    loadChildren: () => import('./acc-verify/acc-verify.module').then(m => m.AccVerifyPageModule)
  },
  {
    path: 'refer',
    loadChildren: () => import('./refer/refer.module').then(m => m.ReferPageModule)
  },
  {
    path: 'guideline',
    loadChildren: () => import('./guideline/guideline.module').then(m => m.GuidelinePageModule)
  },
  {
    path: 'topup',
    loadChildren: () => import('./topup/topup.module').then(m => m.TopupPageModule)
  },
  {
    path: 'topup-details',
    loadChildren: () => import('./topup-details/topup-details.module').then(m => m.TopupDetailsPageModule)
  },
  {
    path: 'mywallet',
    loadChildren: () => import('./mywallet/mywallet.module').then(m => m.MywalletPageModule)
  },
  {
    path: 'withdrawal',
    loadChildren: () => import('./withdrawal/withdrawal.module').then(m => m.WithdrawalPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then(m => m.OrderPageModule)
  },
  {
    path: 'placeorder',
    loadChildren: () => import('./placeorder/placeorder.module').then(m => m.PlaceorderPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./order-details/order-details.module').then(m => m.OrderDetailsPageModule)
  },
  {
    path: 'result',
    loadChildren: () => import('./result/result.module').then(m => m.ResultPageModule)
  },
  {
    path: 'share-result',
    loadChildren: () => import('./share-result/share-result.module').then(m => m.ShareResultPageModule)
  },
  {
    path: 'tnc',
    loadChildren: () => import('./tnc/tnc.module').then(m => m.TncPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then(m => m.OTPPageModule)
  },
  {
    path: 'network',
    loadChildren: () => import('./network/network.module').then(m => m.NetworkPageModule)
  },
  {
    path: 'updateprofile',
    loadChildren: () => import('./updateprofile/updateprofile.module').then(m => m.UpdateprofilePageModule)
  },  {
    path: 'result-list',
    loadChildren: () => import('./result-list/result-list.module').then( m => m.ResultListPageModule)
  },
  {
    path: 'picture',
    loadChildren: () => import('./picture/picture.module').then( m => m.PicturePageModule)
  },
  {
    path: 'chart',
    loadChildren: () => import('./chart/chart.module').then( m => m.ChartPageModule)
  },
  {
    path: 'email-verification',
    loadChildren: () => import('./email-verification/email-verification.module').then( m => m.EmailVerificationPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
