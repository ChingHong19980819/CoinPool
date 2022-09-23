import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, NavController } from '@ionic/angular';
declare var Swal;

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  constructor(private nav: NavController, private outlet: IonRouterOutlet, private router: Router) { }

  lang = localStorage.getItem('coinpool_language') || 'English'

  select

  selections = [
    { value: 'English', name: 'English' },
    { value: 'Chinese', name: '中文' },
  ]


  langua = {
    ["Select Language"]: {
      Chinese: "选择语言",
      English: "Select Language",
    },
    ["Save"]: {
      Chinese: "储存",
      English: "Save",
    },
    ["Are you sure?"]: {
      Chinese: "是否确定？",
      English: "Are you sure?",
    },
    ["Language Updated"]: {
      Chinese: "更新语言",
      English: "",
    },
    ["Taking you back to the home page..."]: {
      Chinese: "带你回到首页...",
      English: "Taking you back to the home page...",
    },

  }

  ngOnInit() {
  }

  back() {
    this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['profile'], { replaceUrl: true });

  }

  setLanguage(x) {

    this.select = x.value

  }

  save() {
    console.log('testing')

    Swal.fire({
      title: this.langua['Save'][this.lang],
      text: this.langua['Are you sure?'][this.lang],
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((val) => {
      if (val.isConfirmed) {

        Swal.fire({
          icon: 'success',
          title: this.langua['Language Updated'][this.lang],
          text: this.langua['Taking you back to the home page...'][this.lang],
          timer: 2000,
          buttons: [false],
        })

        localStorage.setItem('coinpool_language', this.select)
        console.log(this.select);

        this.nav.navigateRoot('home')
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }

    })
  }

}
