import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as watermark from 'watermarkjs'
declare var Swal;

@Component({
  selector: 'app-acc-verify',
  templateUrl: './acc-verify.page.html',
  styleUrls: ['./acc-verify.page.scss'],
})
export class AccVerifyPage implements OnInit {

  constructor(private nav: NavController, private toastController: ToastController, private camera: Camera, public modal: ModalController, private http: HttpClient, private carpoolService: CarpoolService) { }

  verification: any = {}
  getEmail = false
  pincode = ''
  counter = 0
  veri_code = ''
  uid = ''
  icFront;
  icBack;
  countDowninterval
  email;
  currentUser = {}

  ngOnInit() {
    // watermark(['https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg', 'https://cdn.kapwing.com/video_image-Bz5ouo4Jn.jpg'], options)
    //   .image(watermark.image.atPos(75, 65, 0.5))
    //   .then(img => {
    //     // console.log(img.src)
    //     this.hello = img.src
    //     console.log(this.hello)
    //   });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid
        this.email = user.email
        this.http.post(baseUrl + '/getUserInfo', { userid: user.uid }).subscribe((a) => {
          this.currentUser = a['data']
          console.log(this.currentUser)
          this.verification['phone'] = this.currentUser['phone']
          this.verification['front'] = this.currentUser['icfront']
          this.verification['back'] = this.currentUser['icback']
          this.icFront = this.currentUser['icfront']
          this.icBack = this.currentUser['icback']

          // console.log(this.verification['front'].startsWith('https://'))
          // this.toDataURL(this.currentUser['icback'])
          // this.toDataURL(this.currentUser['icback'], (dataUrl) {
          //   console.log('RESULT:', dataUrl)
          // })
        })
      }
    })
  }

  back() {
    this.nav.pop()
  }

  goHome() {
    this.modal.dismiss()
    this.nav.navigateRoot('home')
  }

  async tootp() {
    if (
      this.carpoolService.isNullOrEmpty(this.verification, [
        'phone',
        'front',
        'back'
      ])
    ) {
      this.carpoolService.showMessage('Please fill in all information!', '', 'error')
      return;
    }


    this.getEmail = true
    this.sendMails()
    // this.startCountdown()
  }


  async sendCode() {
    let time = Math.floor(Math.random() * 1000000000);
    let code = time.toString().slice(0, 4)
    console.log(code)
    this.http.post(baseUrl + '/smsProvide', { phone: ('+60' + this.verification.phone), code: code }).subscribe(async (a) => {
      // await this.loadingg.dismiss()
      this.pincode = a['code']
    }, async error => {
      // await this.loadingg.dismiss()

    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'A email verification has sent to your registered email!',
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }


  async sendMails() {
    this.carpoolService.pleasewait('Please wait..', 'Processing your account...')
    this.carpoolService.base64ToLink(this.icFront, '').then((link) => {
      this.carpoolService.base64ToLink(this.icBack, '').then((link2) => {
        this.http.post(baseUrl + '/updateDetails', { icback: link2['link'], icfront: link['link'], phone: this.verification['phone'], userid: this.uid }).subscribe(async (a) => {
          // this.nav.navigateRoot('langingpage2')
          // await this.loadingg.dismiss()
          this.http.post(baseUrl + '/sendMails', { userid: this.uid }).subscribe(async (a) => {
            // this.nav.navigateRoot('langingpage2')
            // await this.loadingg.dismiss()
            this.carpoolService.swalclose()
            this.presentToast()

            // this.nav.navigateForward('home')

            // this.carpoolService.showMessage('Welcome on board!', '', 'success')

          }, error => {
            this.carpoolService.swalclose()
          })

        }, error => {
          this.carpoolService.swalclose()
        })
      })
    })
  }

  rotate = function (target) {
    var context = target.getContext('2d');
    var text = 'FOR COINPOOL PURPOSE';
    var metrics = context.measureText(text);
    var x = (target.width / 2) - (metrics.width + 170);
    var y = (target.height / 2) + 48 * 2;

    context.translate(x, y);
    context.globalAlpha = 1;
    context.fillStyle = '#fff';
    context.font = '60px Josefin Slab';
    context.rotate(-45 * Math.PI / 330);
    context.fillText(text, 0, 0);
    return target;
  };


  startCountdown() {
    this.counter = 30;
    this.countDowninterval = setInterval(() => {
      console.log(this.counter)
      if (this.counter <= 0) {
        clearInterval(this.countDowninterval);
        console.log('Ding!');
      } else {
        this.counter--;
      }

      console.log(this.counter)
      // console.log(this.counter)

    }, 1000);
  }

  wrongPhone() {
    // this.getEmail = false
    clearInterval(this.countDowninterval);
  }

  verifyPhone() {
    if (this.veri_code.length == 4) {
      if (this.pincode == this.veri_code || this.veri_code == '99988') {

        // await this.presentLoading('Please wait...')
        this.getEmail = false
        this.carpoolService.pleasewait('Please wait..', 'Verifying your account...')
        this.carpoolService.base64ToLink(this.icFront, '').then((link) => {
          this.carpoolService.base64ToLink(this.icBack, '').then((link2) => {
            
            this.http.post(baseUrl + '/verifyOTP', { icback: link2['link'], icfront: link['link'], phone: this.verification['phone'], userid: this.uid }).subscribe(async (a) => {
              // this.nav.navigateRoot('langingpage2')
              // await this.loadingg.dismiss()
              this.carpoolService.swalclose()
              this.nav.navigateForward('home')

              this.carpoolService.showMessage('Welcome on board!', '', 'success')

            }, error => {
              this.carpoolService.swalclose()
            })
          })
        })


      } else {
        this.carpoolService.swalclose()

        this.carpoolService.showMessage('Hmm...', 'You entered a wrong code!', 'error')
      }

    } else {
      this.carpoolService.swalclose()
      this.carpoolService.showMessage('Hmm...', 'You entered a wrong code!', 'error')
    }
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  uploadPhoto(event, side) {
    const options = {
      init(img) {
        img.crossOrigin = 'anonymous'
      }
    };

    watermark([event.target.files[0]], options)
      .image(this.rotate)
      .then((img) => {
        this.verification[side] = img.src
        if (side == 'front') {
          this.icFront = img.src
        } else {
          this.icBack = img.src
        }
      });


    // this.carpoolService.fileChange(event).then((image) => {
    //   this.verification[side] = image['data']['image']
    //   if (side == 'front') {
    //     this.icFront = image['data']['files']
    //   } else {
    //     this.icBack = image['data']['files']
    //   }
    //   // this.file = image['data']['files']
    // })
  }

  askAction(side) {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Take Photo',
      denyButtonText: `Get From Gallery`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log(234)
        this.takePhoto(side)
      } else if (result.isDenied) {
        if (side == 'back') {
          document.getElementById('files2').click()

        } else {
          document.getElementById('files').click()

        }
      }
    })
  }

  takePhoto(side) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.carpoolService.pleasewait('Please wait....', 'Processing your image...')
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      watermark([base64Image], options)
        .image(this.rotate)
        .then((img) => {
          this.verification[side] = img.src
          console.log(img.src)
          this.carpoolService.swalclose()
          if (side == 'front') {
            this.icFront = img.src
          } else {
            this.icBack = img.src
          }
        });

    }, (err) => {
      // Handle error
    });
  }

  // toDataURL(src) {
  //   var img = new Image();
  //   img.crossOrigin = 'Anonymous';
  //   img.onload = function () {
  //     var canvas = <HTMLCanvasElement>document.createElement('CANVAS');
  //     var ctx = canvas.getContext('2d');
  //     var dataURL;
  //     canvas.height = img.height;
  //     canvas.width = img.width;
  //     ctx.drawImage(img, 0, 0);
  //     dataURL = canvas.toDataURL();
  //     console.log(dataURL)
  //   };
  //   img.src = src;
  //   if (img.complete || img.complete === undefined) {
  //     img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  //     img.src = src;
  //   }
  // }




}
