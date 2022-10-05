import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CoinpoolGuard } from './coinpool.guard';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canLoad: [CoinpoolGuard]
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
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'acc-verify',
    loadChildren: () => import('./acc-verify/acc-verify.module').then(m => m.AccVerifyPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'refer',
    loadChildren: () => import('./refer/refer.module').then(m => m.ReferPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'guideline',
    loadChildren: () => import('./guideline/guideline.module').then(m => m.GuidelinePageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'topup',
    loadChildren: () => import('./topup/topup.module').then(m => m.TopupPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'topup-details',
    loadChildren: () => import('./topup-details/topup-details.module').then(m => m.TopupDetailsPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'mywallet',
    loadChildren: () => import('./mywallet/mywallet.module').then(m => m.MywalletPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'withdrawal',
    loadChildren: () => import('./withdrawal/withdrawal.module').then(m => m.WithdrawalPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then(m => m.OrderPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'placeorder',
    loadChildren: () => import('./placeorder/placeorder.module').then(m => m.PlaceorderPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./order-details/order-details.module').then(m => m.OrderDetailsPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'result',
    loadChildren: () => import('./result/result.module').then(m => m.ResultPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'share-result',
    loadChildren: () => import('./share-result/share-result.module').then(m => m.ShareResultPageModule)
  },
  {
    path: 'tnc',
    loadChildren: () => import('./tnc/tnc.module').then(m => m.TncPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then(m => m.OTPPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'network',
    loadChildren: () => import('./network/network.module').then(m => m.NetworkPageModule)
  },
  {
    path: 'updateprofile',
    loadChildren: () => import('./updateprofile/updateprofile.module').then(m => m.UpdateprofilePageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'result-list',
    loadChildren: () => import('./result-list/result-list.module').then(m => m.ResultListPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'picture',
    loadChildren: () => import('./picture/picture.module').then(m => m.PicturePageModule)
  },
  {
    path: 'chart',
    loadChildren: () => import('./chart/chart.module').then(m => m.ChartPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'email-verification',
    loadChildren: () => import('./email-verification/email-verification.module').then(m => m.EmailVerificationPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyPageModule),
    canLoad: [CoinpoolGuard]
  },
  {
    path: 'update',
    loadChildren: () => import('./update/update.module').then(m => m.UpdatePageModule)
  },
  {
    path: 'exchange-rate',
    loadChildren: () => import('./exchange-rate/exchange-rate.module').then(m => m.ExchangeRatePageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarPageModule)
  },
  {
    path: 'coinlist',
    loadChildren: () => import('./coinlist/coinlist.module').then(m => m.CoinlistPageModule)
  },
  {
    path: 'coinlist2',
    loadChildren: () => import('./coinlist2/coinlist2.module').then(m => m.Coinlist2PageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./language/language.module').then(m => m.LanguagePageModule)
  },  {
    path: 'referral-wallet',
    loadChildren: () => import('./referral-wallet/referral-wallet.module').then( m => m.ReferralWalletPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
