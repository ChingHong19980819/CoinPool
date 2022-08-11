import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.page.html',
  styleUrls: ['./tnc.page.scss'],
})
export class TncPage implements OnInit {

  text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend, elit in efficitur posuere, sem felis rhoncus neque, at rutrum lacus massa non diam. Sed lectus neque, viverra ut cursus sit amet, rhoncus quis metus. Praesent quis ultricies erat. Maecenas non sem euismod, luctus quam nec, ornare eros. Morbi posuere mauris a commodo vulputate. Nam scelerisque, neque sit amet placerat molestie, nisl tortor commodo massa, sed gravida augue arcu nec lectus. Aliquam erat volutpat. In dolor magna, aliquam in vehicula pharetra, efficitur vitae arcu. Sed in risus est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus quam lectus, at semper ligula pellentesque nec. Curabitur mattis, orci sit amet eleifend maximus, eros elit condimentum diam, non consequat tellus nunc vulputate justo. Fusce id enim sit amet dolor mattis rutrum.'

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {

  }

  show() {
    console.log(document.getElementById("hellomodal"))
    console.log(document.getElementsByClassName('modal-wrapper'))
    console.log(document.getElementsByTagName("ion-backdrop"))
    console.log(document.getElementsByTagName("ion-content"))


  }

}
