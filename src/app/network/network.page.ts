import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {
  constructor(
    private modal: ModalController
  ) { }

  ngOnInit() { }

  close() {
    this.modal.dismiss()
  }

  confirm() {
    this.modal.dismiss('Tron (TRC 20)')
  }
}
