import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

@Component({
  selector: 'app-guideline',
  templateUrl: './guideline.page.html',
  styleUrls: ['./guideline.page.scss'],
})
export class GuidelinePage implements OnInit {

  @ViewChild('slides', { static: false }) slides: IonSlides;


  constructor(private nav: NavController) { }
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
      this.nav.pop()
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
