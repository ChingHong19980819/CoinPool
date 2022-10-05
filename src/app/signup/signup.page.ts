import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { CarpoolService } from '../carpool.service';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, NavController } from '@ionic/angular';
declare var Swal;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(
    private carpoolService: CarpoolService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private nav: NavController
  ) { }

  user: any = {};
  referralId = ''
  text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend, elit in efficitur posuere, sem felis rhoncus neque, at rutrum lacus massa non diam. Sed lectus neque, viverra ut cursus sit amet, rhoncus quis metus. Praesent quis ultricies erat. Maecenas non sem euismod, luctus quam nec, ornare eros. Morbi posuere mauris a commodo vulputate. Nam scelerisque, neque sit amet placerat molestie, nisl tortor commodo massa, sed gravida augue arcu nec lectus. Aliquam erat volutpat. In dolor magna, aliquam in vehicula pharetra, efficitur vitae arcu. Sed in risus est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus quam lectus, at semper ligula pellentesque nec. Curabitur mattis, orci sit amet eleifend maximus, eros elit condimentum diam, non consequat tellus nunc vulputate justo. Fusce id enim sit amet dolor mattis rutrum.'
  @ViewChild('slides', { static: false }) slides: IonSlides;

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified) {

      }
    });
  }

  ionViewWillEnter() {
    // this.slides.lockSwipes(true);
    this.activatedRoute.queryParams.subscribe((b) => {
      this.user['code'] = b['code'] || ''
    })
  }

  nextPage() {
    if (
      this.carpoolService.isNullOrEmpty(this.user, [
        'name',
        'password',
        'email',
        'phone'
      ])
    ) {
      this.carpoolService.showMessage('Please fill in all information!', '', 'error')
      return;
    }

    if (this.user['password'].length < 6) {
      this.carpoolService.showMessage('The password length should greater than 5!', '', 'error')
      return
    }

    if (this.user['password'] != this.user['comfirmPassword']) {
      this.carpoolService.showMessage('The password and confirm password is not same!', '', 'error')
      return;
    }

    if (this.user['code'] != '') {
      this.http.post(baseUrl + '/checkReferral', { code: this.user['code'] }).subscribe(
        (res) => {
          if (res['success'] == true) {
            this.slides.lockSwipes(false)
            this.slides.slideNext()
            this.slides.lockSwipes(true)
          } else {
            this.carpoolService.showMessage('Fail', res['message'], 'error')
          }

        })

    } else {
      this.slides.lockSwipes(false)
      this.slides.slideNext()
      this.slides.lockSwipes(true)
    }





  }


  userSignUp() {

    if (
      this.carpoolService.isNullOrEmpty(this.user, [
        'name',
        'password',
        'email',
        'phone'
      ])
    ) {
      this.carpoolService.showMessage('Please fill in all information!', '', 'error')
      return;
    }

    if (this.user['password'].length < 6) {
      this.carpoolService.showMessage('The password length should greater than 5!', '', 'error')
      return
    }

    if (this.user['password'] != this.user['comfirmPassword']) {
      this.carpoolService.showMessage('The password and confirm password is not same!', '', 'error')
      return;
    }

    this.carpoolService.pleasewait('Please wait..', 'Registering your account!')

    this.http.post('https://coinpoolapi.coinpoolfund.com/checkerusername', { user_name: this.user['user_name'] }).subscribe(user => {

      if (user['data'].length > 0) {

        this.carpoolService.swalclose()

        Swal.fire({
          icon: 'error',
          title: 'User Name Already Taken',
          text: 'Please Change a user name',
          showCancelButton: false, // There won't be any cancel button
          showConfirmButton: false,
          timer: 2000
        })

      } else {

        firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password).then((user) => {
          firebase.auth().currentUser.sendEmailVerification().then(() => {
            this.user['userid'] = user.user.uid


            if (this.user['code'] != '') {
              this.http.post(baseUrl + '/registerUser', this.user).subscribe(
                (res) => {
                  this.carpoolService.swalclose()
                  if (res['success'] == true) {
                    this.carpoolService.showMessage('Success', res['message'], 'success')
                    this.nav.navigateRoot('login')
                    this.user = {}
                  } else {
                    this.carpoolService.showMessage('Fail', res['message'], 'error')
                  }
                },
                (error) => {
                  this.carpoolService.swalclose()
                  this.carpoolService.showMessage('Fail', error['message'], 'error')
                }
              );
            } else {
              this.http.post(baseUrl + '/registerUser2', this.user).subscribe(
                (res) => {
                  this.carpoolService.swalclose()
                  if (res['success'] == true) {
                    this.carpoolService.showMessage('Success', res['message'], 'success')
                    this.nav.navigateRoot('login')
                    this.user = {}
                  } else {
                    this.carpoolService.showMessage('Fail', res['message'], 'error')
                  }
                },
                (error) => {
                  this.carpoolService.swalclose()
                  this.carpoolService.showMessage('Fail', error['message'], 'error')
                }
              );
            }


          })

        }).catch((error) => {
          this.carpoolService.swalclose()

          this.carpoolService.showMessage('Fail', error['message'], 'error')
        })

      }

    })




  }

  navBack() {
    this.slides.lockSwipes(false)
    this.slides.slidePrev()
    this.slides.lockSwipes(true)

  }
}
