import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-check-out-successful',
  templateUrl: './check-out-successful.component.html',
  styleUrls: ['./check-out-successful.component.scss']
})
export class CheckOutSuccessfulComponent implements OnInit {
  orderSuccess: boolean = true;
  constructor(private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.data.subscribe(data => {
      this.orderSuccess = data['orderSuccess'];
    })
  }

  ngOnInit() {
    
  }

}
