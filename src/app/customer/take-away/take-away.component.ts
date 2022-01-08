import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import * as _ from 'lodash';
import { CartDetail } from 'src/dtos/cart/cart-detail';
import { TakeAwayProduct } from 'src/dtos/product/take-away-product';

@Component({
  selector: 'app-take-away',
  templateUrl: './take-away.component.html',
  styleUrls: ['./take-away.component.scss']
})
export class TakeAwayComponent implements OnInit {
  @ViewChild("productTypeNav") productTypeNav!: ElementRef;
  menuOpen: boolean = false;
  sticky: boolean = false;
  isExpaned: boolean = false;
  products: TakeAwayProduct[] = [
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'TASTING MENU',
      productTypeId: '1',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'TASTING MENU',
      productTypeId: '1',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'ENTRADAS',
      productTypeId: '2',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'BOCADILLO',
      productTypeId: '3',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'PHO TRADICIONAL',
      productTypeId: '3',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'VERMICELLI DE ARROZ',
      productTypeId: '3',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'VEGANO',
      productTypeId: '3',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'ESPECIAL',
      productTypeId: '3',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
    {
      name: 'Banh mi',
      esName: 'Banh mi',
      caName: 'Banh mi',
      price: 6.5,
      productTypeName: 'BEDIAS',
      productTypeId: '3',
      images: [
        {
          id: '',
          isMain: true,
          name: '',
          url: ''
        }
      ]
    },
  ];

  displayProduct: any;

  cartDetail: CartDetail = {
    totalPrice: 50,
    subTotalPrice: 45,
    products: [
      {
        name: 'Banh mi 1 ',
        esName: 'Banh mi 1',
        caName: 'Banh mi 1',
        price: 6.5,
        id: '1',
        quantity: 10
      },
      {
        name: 'Banh mi 2',
        esName: 'Banh mi 2',
        caName: 'Banh mi 2',
        price: 6.5,
        id: '1',
        quantity: 6
      },
      {
        name: 'Banh mi 3',
        esName: 'Banh mi 3',
        caName: 'Banh mi 3',
        price: 6.5,
        id: '2',
        quantity: 6
      },
      {
        name: 'Banh mi 4',
        esName: 'Banh mi 4',
        caName: 'Banh mi 4',
        price: 6.5,
        id: '2',
        quantity: 7
      },
    ]
  };

  constructor(private store: Store, private titleService: Title) {
    this.titleService.setTitle("Little Viet - Take Away");
  }

  ngOnInit() {
    this.displayProduct = _.chain(this.products)
    .groupBy(p => p.productTypeName)
    .map((value, key) => ({ productType: key, products: value }))
    .value();
    console.log(this.displayProduct);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
      if (window.pageYOffset > this.productTypeNav.nativeElement.getBoundingClientRect().top) {
        this.sticky = true;
      } else {
        this.sticky = false;
      }
  }

  clickBtn() {
    
  }
}
