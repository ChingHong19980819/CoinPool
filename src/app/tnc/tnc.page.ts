import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.page.html',
  styleUrls: ['./tnc.page.scss'],
})
export class TncPage implements OnInit {

  text = `Information we collect
  The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
  
  If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
  
  When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
  
  How we use your information
  We use the information we collect in various ways, including to:
  
  Provide, operate, and maintain our website
  Improve, personalize, and expand our website
  Understand and analyze how you use our website
  Develop new products, services, features, and functionality
  Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes
  Send you emails
  Find and prevent fraud`

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
