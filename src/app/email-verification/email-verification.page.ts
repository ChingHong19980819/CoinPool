import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { baseUrl } from 'src/environments/environment.prod';
import { CarpoolService } from '../carpool.service';
declare var Swal;

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private carPool: CarpoolService,
    private http: HttpClient
  ) { }

  userid;

  ngOnInit() {
    this.carPool.pleasewait('Please wait...', 'Verifying Your Email')
    this.activatedRoute.queryParams.subscribe((a) => {
      this.userid = a['userid']
      this.http.post(baseUrl + '/emailVerify', { userid: this.userid }).subscribe((a) => {
        this.carPool.swalclose()
        window.open('https://coinpool.page.link/6SuK')
      })
    })
  }

}
