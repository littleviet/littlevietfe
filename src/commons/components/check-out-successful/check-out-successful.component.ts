import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ClearCart } from 'src/app/actions/take-away.action';

@Component({
  selector: 'app-check-out-successful',
  templateUrl: './check-out-successful.component.html',
  styleUrls: ['./check-out-successful.component.scss']
})
export class CheckOutSuccessfulComponent implements OnInit {
  orderSuccess: boolean = true;
  constructor(private activatedRoute: ActivatedRoute, private store: Store) { 
    this.activatedRoute.data.subscribe(data => {
      this.orderSuccess = data['orderSuccess'];
      if (this.orderSuccess) {
        this.store.dispatch(new ClearCart());
      }
    })
  }

  ngOnInit() {
    
  }

}
