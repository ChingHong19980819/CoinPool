import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';
declare var Swal;
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
})
export class UpdateprofilePage implements OnInit {

  constructor(private nav: NavController, private outlet: IonRouterOutlet, private router: Router, private http: HttpClient, private carPool: CarpoolService) { }
  currentUser: any = {}

  userid = ''

  // lang = 'English'


  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["Username"]: {
      Chinese: "用户名称",
      English: "Username",
    }, ["Email"]: {
      Chinese: "邮箱",
      English: "Email",
    }, ["Phone Number"]: {
      Chinese: "电话号码",
      English: "Phone Number",
    }, ["Change Password"]: {
      Chinese: "更改密码",
      English: "Change Password"
    }, ["Update"]: {
      Chinese: "更新",
      English: "Update"
    },
    ["Edit Profile"]: {
      Chinese: "更新资料",
      English: "Edit Profile"
    },
    ["Full Name"]: {
      Chinese: "姓名",
      English: "Full Name",
    },
  }


  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
          console.log(this.currentUser)
        })

      }
    })
  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['profile'], { replaceUrl: true });
  }

  updateProfile() {

    if (!this.currentUser['user_name']) {

      Swal.fire({
        icon: 'error',
        title: 'User Name Missing',
        text: 'Please make sure user name is filled',
        showCancelButton: false, // There won't be any cancel button
        showConfirmButton: false,
        timer: 2000
      })

    } else {

      this.carPool.swal_button('Update Profile', 'Are you sure want to update your profile?', 'warning').then((ans) => {
        if (ans == 'Confirm') {

          this.carPool.pleasewait('Please wait..', 'Updating your profile')

          this.http.post('https://coinpoolapi.coinpoolfund.com/checkerusername', { user_name: this.currentUser['user_name'] }).subscribe(user => {

            // console.log(user)

            // console.log(user['data'].length > 0)

            // console.log(user['data'].filter(b => b['userid'] == this.currentUser['userid']).length == 0)

            if (user['data'].length > 0 && user['data'].filter(b => b['userid'] == this.currentUser['userid']).length == 0) {
              this.carPool.swalclose()
              Swal.fire({
                icon: 'error',
                title: 'User Name Already Taken',
                text: 'Please Change a user name',
                showCancelButton: false, // There won't be any cancel button
                showConfirmButton: false,
                timer: 2000
              })

            } else {

              this.http.post(baseUrl + '/updateProfile', { name: this.currentUser.name, user_name: this.currentUser.user_name, phone: this.currentUser['phone'], picture: this.currentUser['photo'], userid: firebase.auth().currentUser.uid }).subscribe((b) => {
                this.carPool.swalclose()
                this.carPool.showMessage('Update Successfully', '', 'success')
                this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['profile'], { replaceUrl: true });
              })

            }

          })





        }

      })
    }




  }

  fileChange(event) {
    this.carPool.fileChange(event).then((image) => {
      this.carPool.base64ToLink(image['data']['image'], '').then((a) => {
        this.currentUser['photo'] = a['link']

      })
    })
  }





  changepassword() {

    Swal.fire({
      title: 'Enter New Password',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {

        // console.log('123213')
        // console.log(result.value)
        if (result.value) {

          let password1 = result.value
          Swal.fire({
            title: 'Confirm Your password',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            showLoaderOnConfirm: true,
          }).then((result2) => {
            if (result.isConfirmed) {


              if (password1 == result2.value) {

                // console.log('donr')

                this.http.post(baseUrl + '/changepassword', { userid: firebase.auth().currentUser.uid, password: password1 }).subscribe((a) => {

                  if (a['success'] == 'Works') {

                    Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: 'Your Password has been Change',
                      showConfirmButton: false,
                      timer: 1500
                    })

                  } else {

                    Swal.fire({
                      icon: 'error',
                      title: 'Something Wrong',
                      text: 'Pease try again later',
                      showConfirmButton: false,
                      timer: 1500
                    })

                  }

                })


              } else {

                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Password not match',
                  showConfirmButton: false,
                  timer: 1500
                })

                // console.log('no')

              }


            }
          })

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Password Empty',
            text: 'Password Cannot be Empty',
            showConfirmButton: false,
            timer: 1500
          })

        }

      }
    })

  }

}
