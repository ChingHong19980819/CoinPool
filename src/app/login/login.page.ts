import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { CarpoolService } from '../carpool.service';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment.prod';
import * as lodash from 'lodash';
declare var Swal;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private nav: NavController, private toastController: ToastController, private carpoolService: CarpoolService, private http: HttpClient) { }

  user: any = {}
  showPassword = false

  ngOnInit() {
    var mydata = [
      // {
      //   "module_code": "123",
      //   "students": [{ cms_student_id: '1235' }],
      // },
      // {
      //   "module_code": "1234",
      //   "students": [{ cms_student_id: '1235' }],
      // },
      // {
      //   "module_code": "1235",
      //   "students": [{ cms_student_id: '12346' }],
      // },
      // {
      //   "module_code": "1235",
      //   "students": [{ cms_student_id: '12347' }],
      // }
    ];

    // this.http.get('assets/exam.json').subscribe((arr: any) => {

    //   mydata = arr.sort((c, v) => v['noOfStudent'] - c['noOfStudent'])
    //   // .filter(b => b['type_list'][0]['type'] == 'finals' && b['noOfStudent'] >= 27)
    //   console.log(mydata)
    //   // return
    //   let all = []
    //   // console.log(mydata)

    //   while (mydata.length != 0) {

    //     let newData = JSON.parse(JSON.stringify(mydata))

    //     let step = 0

    //     let hello = newData.reduce((acc, curr) => {
    //       let newArr = lodash.intersectionBy(lodash.flatten(acc.map(b => b['students'].map(s => s['cms_student_id']))), curr.students.map(b => b['cms_student_id']))

    //       if (newArr.length == 0) {
    //         acc.push(curr)
    //         mydata.splice(mydata.findIndex(m => m['module_code'] == curr['module_code']), 1)
    //         step++
    //       }

    //       return acc;
    //     }, []);

    //     all.push(hello)

    //   }

    //   let newArr = []

    //   // console.log(lodash.maxBy(all, i => i.length).length / 5)

    //   // console.log([1234].slice(0, 5))

    //   // for (let x = 0; x < Math.ceil(lodash.maxBy(all, i => i.length).length / 5); x++) {
    //   //   for (let a = 0; a < all.length; a++) {
    //   //     newArr = newArr.concat(all[a].slice((5 * x), (5 * (x + 1))))
    //   //   }
    //   // }

    //   console.log(newArr)

    //   // for (let x = 0; x < lodash.maxBy(all, i => i.length).length; x++) {
    //   //   for (let a = 0; a < 1; a++) {
    //   //     console.log(all[a])

    //   //     break
    //   //   }

    //   //   break

    //   // }


    //   // console.log(newArr.map(c => c['module_code']))


    // })


    let groups = [[], [], [], [], [], [], [], []]


    this.http.get('assets/exam.json').subscribe((arr: any) => {
      let mydata = arr.sort((c, v) => v['noOfStudent'] - c['noOfStudent'])
      let tempAllExam = []
      let allExam = []

      let newData = JSON.parse(JSON.stringify(mydata))

      while (mydata.length != 0) {

        let newData = JSON.parse(JSON.stringify(mydata))

        let nocrashArr = newData.reduce((acc, curr) => {
          let newArr = lodash.intersectionBy(lodash.flatten(acc.map(b => b['students'].map(s => s['cms_student_id']))), curr.students.map(b => b['cms_student_id']))

          if (newArr.length == 0) {
            acc.push(curr)
            mydata.splice(mydata.findIndex(m => m['module_code'] == curr['module_code']), 1)
          }

          return acc;
        }, []);

        tempAllExam.push(nocrashArr)
      }

      for (let x = 0; x < Math.ceil(lodash.maxBy(tempAllExam, i => i.length).length / 5); x++) {
        for (let a = 0; a < tempAllExam.length; a++) {
          allExam = allExam.concat(tempAllExam[a].slice((5 * x), (5 * (x + 1))))
        }
      }

      // for (let x = 0; x < newData.length; x++) {

      //   groups = groups.sort((a, b) => a.length - b.length)

      //   for (let g = 0; g < groups.length; g++) {

      //     let newArr = lodash.intersectionBy(lodash.flatten(groups[g].map(b => b['students'].map(s => s['cms_student_id']))), newData[x].students.map(b => b['cms_student_id']))

      //     if (newArr.length == 0) {
      //       groups[g].push(newData[x])
      //       break
      //     }

      //     // if (g == (groups.length - 1)) {
      //     //   groups[g + 1] = []
      //     //   groups[g + 1].push(newData[x])
      //     //   break
      //     // }

      //   }

      // }

    })

    // let arr = [1, 2, 3, 4, 5, 5, 3, 2, 1, 6, 7, 4, 8, 9, 6, 4, 2, 1]




    // console.log(groups)




    firebase.auth().onAuthStateChanged((user) => {
      this.carpoolService.pleasewait('Authenticating..', 'Please wait...')

      if (user) {
        this.nav.navigateRoot('home')
        this.carpoolService.swalclose()

        // if (user.emailVerified == false) {
        //   setTimeout(() => {
        //     this.carpoolService.swal_button2('Account Verification', 'Your account is not verified yet. Click RESEND and check your inbox to verify your account!', 'warning').then((a) => {
        //       if (a == 'Confirm') {
        //         user.sendEmailVerification()
        //         this.presentToast('Verification email has been sent!')
        //       }
        //     })
        //   }, 0);

        // } else {

        // }
        // this.http.post(baseUrl + '/checkUserStatus', { userid: user.uid }).subscribe((b) => {

        // })
      } else {
        this.carpoolService.swalclose()
      }


    })

  }

  async presentToast(x) {
    const toast = await this.toastController.create({
      message: x,
      position: 'bottom',
      duration: 2000,
      color: 'warning'
    });
    toast.present();
  }

  gosignup() {
    this.nav.navigateForward('signup')
  }

  gohome() {
    this.nav.navigateForward('home')
  }

  login() {
    if (this.carpoolService.isNullOrEmpty(this.user, ['email', 'password'])) {
      this.carpoolService.showMessage('Please fill in all information!', '', 'error')
      return
    }

    this.carpoolService.pleasewait('Authenticating..', 'Please wait...')

    firebase.auth().signInWithEmailAndPassword(this.user['email'], this.user['password']).then(() => {

    }).catch((error) => {
      this.carpoolService.swalclose()
      this.carpoolService.showMessage('Error', error.message, 'error')
    })
  }

  emailValidator(email) {
    if (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    } else {
      return false;
    }
  }

  forgot() {

    Swal.fire({
      title: 'Enter Your Email Address',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {

        if (result.value && this.emailValidator(result.value)) {


          firebase.auth().sendPasswordResetEmail(result.value).then(a => {

            Swal.fire({
              icon: 'success',
              title: 'Reset Password Email Sended',
              text: 'Please check your inbox',
              showConfirmButton: false,
              timer: 1500
            })

          }).catch((e) => {

            Swal.fire({
              icon: 'error',
              title: e.message,
              showConfirmButton: false,
              timer: 1500
            })

          })

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Email Badly Format',
            text: 'Please make suer your email is correct',
            showConfirmButton: false,
            timer: 1500
          })

        }

      }
    })

  }

}
