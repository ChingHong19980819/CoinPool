import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guideline',
  templateUrl: './guideline.page.html',
  styleUrls: ['./guideline.page.scss'],
})
export class GuidelinePage implements OnInit {

  @ViewChild('slides', { static: false }) slides: IonSlides;
  lang = localStorage.getItem('coinpool_language') || 'English'

  langua = {
    ["Guideline"]: {
      Chinese: "指南",
      English: "Guideline",
    }, ["Result History"]: {
      Chinese: "历史成绩",
      English: "Result History",
    }
  }

  constructor(private nav: NavController, private outlet: IonRouterOutlet, private router: Router) { }
  videos = []
  videoPath = ''
  currentStep = 0;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  ngOnInit() {
    firebase.database().ref('videos').on('value', data => {
      this.videos = Object.values(data.val())
    })
  }

  ionViewWillEnter() {
    this.slides.lockSwipes(true);
  }

  back() {
    if (this.currentStep == 0) {
      this.outlet.canGoBack() ? this.nav.pop() : this.router.navigate(['profile'], { replaceUrl: true });
    } else {
      let videoSrc = <HTMLVideoElement>document.getElementById('videoPlayer')
      videoSrc.pause()
      this.slides.lockSwipes(false);
      this.slides.slidePrev()
      this.slides.lockSwipes(true);
    }
  }

  slideChanged(e: any) {
    this.slides.getActiveIndex().then((index: number) => {
      this.currentStep = index
    });
  }


  playVideo(path) {
    this.slides.lockSwipes(false);
    this.slides.slideNext()
    this.slides.lockSwipes(true);
    this.videoPath = path;
    let videoSrc = <HTMLVideoElement>document.getElementById('videoPlayer')
    videoSrc.play()
  }
}
