import { Component, Input, OnInit } from '@angular/core';
import { CustomerProduct } from 'src/dtos/product/customer-product';

@Component({
  selector: 'app-menu-slide',
  templateUrl: './menu-slide.component.html',
  styleUrls: ['./menu-slide.component.scss']
})
export class MenuSlideComponent implements OnInit {

  @Input()
  products: CustomerProduct[] = [];

  @Input()
  productType: string = "";

  constructor() { }

  ngOnInit() {
  }

}
