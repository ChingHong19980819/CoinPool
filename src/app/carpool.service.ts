import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as hash from '../assets/hashids.js';
import * as S3 from 'aws-sdk/clients/s3';
declare var Swal;

@Injectable({
  providedIn: 'root',
})
export class CarpoolService {
  constructor(
    private http: HttpClient
  ) { }

  isNullOrEmpty(...args: any[]) {
    let temp = args[0];

    if (temp === undefined || temp === null || temp === '') {
      return true;
    }

    if (typeof temp === 'string') {
      if (temp === undefined || temp === null || temp === '') {
        return true;
      }

      return false;
    }

    if (typeof temp === 'object') {
      let variable = args[1];

      for (let i = 0; i < variable.length; i++) {
        if (
          temp[variable[i]] === undefined ||
          temp[variable[i]] === null ||
          temp[variable[i]] === ''
        ) {
          return true;
        }
      }

      return false;
    }
  }

  showMessage(title, description, icon) {
    Swal.fire({
      title: title,
      text: description,
      icon: icon
    })
  }

  encodeIds(x) {
    const hashids = new hash('coinpoolcoinpoolcoinpool12345678', 7, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
    const shortenIds = hashids.encode(x);
    return shortenIds
  }

  decodeIds(x) {
    const hashids = new hash('coinpoolcoinpoolcoinpool12345678', 7, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
    var originalIds = hashids.decode(x)
    return originalIds
  }

  fileChange(event) {
    return new Promise((resolve, reject) => {
      if (event.target.files && event.target.files[0] && event.target.files[0].size < (10485768)) {
        var canvas = <HTMLCanvasElement>document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var cw = canvas.width;
        var ch = canvas.height;
        var maxW = 400;
        var maxH = 400;
        var type = event.target.files[0].type;
        var file = event.target.files[0]
        var img = new Image;
        img.onload = () => {
          var iw = img.width;
          var ih = img.height;
          var scale = Math.min((maxW / iw), (maxH / ih));
          var iwScaled = iw * scale;
          var ihScaled = ih * scale;
          canvas.width = iwScaled;
          canvas.height = ihScaled;
          ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
          event.target.value = ''


          let imagec = canvas.toDataURL();
          let imgggg = imagec.replace(';base64,', "thisisathingtoreplace;")
          let imgarr = imgggg.split("thisisathingtoreplace;")
          let base64String = imgarr[1]

          resolve({ success: true, data: { image: imagec, files: file, base64String: base64String } })
        }

        img.src = URL.createObjectURL(event.target.files[0]);

      } else {
        reject({ success: false, message: '"Your Current Image Too Large, " + event.target.files[0].size / (10241024) + "MB! (Please choose file lesser than 8MB)"' })
        alert("Your Current Image Too Large, " + event.target.files[0].size / (10241024) + "MB! (Please choose file lesser than 8MB)")
      }
    })
  }

  pictureToLink(file, folder) {
    return new Promise((resolve, reject) => {
      if (file != null && file != undefined && file != '') {
        const bucket = new S3(
          {
            accessKeyId: 'AKIARMQCEK7CLG7HVBIL',
            secretAccessKey: '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',
            region: 'ap-southeast-1'
          }
        );

        const params = {
          Bucket: 'vsnap-photo-server',
          Key: folder + file.name,
          Body: file
        };

        bucket.upload(params, function (err, data) {
          if (err) {
            console.log('There was an error uploading your file: ', err);
            reject({ success: false, message: 'Something went wrong!' })
          }

          console.log(data)

          resolve({ success: true, link: data['Location'] })
        });

        // this.http.post('https://img.vsnap.my/upload', { image: image, folder: 'vsing', userid: (userid + Date.now()) }, { observe: 'response' }).subscribe((res) => {
        //   if (res['status'] === 200) {
        //     resolve({ success: true, link: res['body']['imageURL'] })
        //   }

        //   if (res['status'] !== 200)
        //     reject({ success: false, message: 'Something went wrong!' })
        // }, error => {
        //   reject({ success: false, message: error['message'] })
        // })
      }
    })
  }

  base64ToLink(base64, folder) {
    return new Promise((resolve, reject) => {
      if (base64 != null && base64 != undefined && base64 != '') {

        if (base64.startsWith('https://')) {
          resolve({ success: true, link: base64 })
        }

        const base64Data = this._base64ToArrayBuffer(base64.replace(/^data:image\/\w+;base64,/, ""))
        const type = base64.split(';')[0].split('/')[1];
        const randomKey = Date.now().toString(36).substring(0, 5) + Math.random().toString(36).substr(2).substring(0, 4)

        const bucket = new S3(
          {
            accessKeyId: 'AKIARMQCEK7CLG7HVBIL',
            secretAccessKey: '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',
            region: 'ap-southeast-1'
          }
        );

        const params = {
          Bucket: 'vsnap-photo-server',
          Body: base64Data,
          ContentEncoding: 'base64',
          ContentType: `image/${type}`,
          Key: folder + randomKey,
        };

        bucket.upload(params, function (err, data) {
          if (err) {
            console.log('There was an error uploading your file: ', err);
            reject({ success: false, message: 'Something went wrong!' })
          }

          console.log(data)

          resolve({ success: true, link: data['Location'] })
        });

        // this.http.post('https://img.vsnap.my/upload', { image: image, folder: 'vsing', userid: (userid + Date.now()) }, { observe: 'response' }).subscribe((res) => {
        //   if (res['status'] === 200) {
        //     resolve({ success: true, link: res['body']['imageURL'] })
        //   }

        //   if (res['status'] !== 200)
        //     reject({ success: false, message: 'Something went wrong!' })
        // }, error => {
        //   reject({ success: false, message: error['message'] })
        // })
      }
    })
  }

  _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }


  pleasewait(title, text) {
    Swal.fire({
      title: title,
      html: text,
      timerProgressBar: false,
      allowOutsideClick: false,
      confirmButtonText: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }

  swal_button(title, text, icon) {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: "Yes, I'm sure!"
      }).then((result) => {
        if (result.isConfirmed) {
          resolve('Confirm')
        } else {
          resolve('No')
        }
      })
    })
  }

  swalclose() {
    Swal.close()
  }
}
