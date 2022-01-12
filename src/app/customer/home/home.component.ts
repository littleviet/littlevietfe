import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Select, Store } from '@ngxs/store';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselService } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import { Observable } from 'rxjs';
import { GetProductMenu } from 'src/app/actions/landing-page.action';
import { LandingPageState } from 'src/app/states/landing-page.state';
import { CustomerProductType } from 'src/dtos/product-type/customer-product-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(LandingPageState.getProductMenu) productMenu!: Observable<CustomerProductType[]>;
  @ViewChild('owlElement', { static: true }) carousel!: CarouselComponent;
  menuOpen: boolean = false;
  productsMenu: CustomerProductType[] = [
    {
      "name": "Pho",
      "caName": "Pho",
      "esName": "Pho",
      "products": [
        {
          "name": "Pho Bo",
          "esName": "Pho Bo",
          "caName": "Pho Bo",
          "price": 10
        },
        {
          "name": "Pho Ga",
          "esName": "Pho Ga",
          "caName": "Pho Ga",
          "price": 9
        }
      ]
    },
    {
      "name": "Banh Mi",
      "caName": "Banh Mi",
      "esName": "Banh Mi",
      "products": [
        {
          "name": "Banh Mi Sasiu de Cerdo",
          "esName": "Banh mi sasiu",
          "caName": "Sasiu Banh Mi",
          "price": 6.5
        },
        {
          "name": "Banh Mi cerdo a la plancha",
          "esName": "Banh mi porc a la planxa",
          "caName": "Grilled pork banh mi",
          "price": 6.5
        },
        {
          "name": "Banh Mi de Pollo 2",
          "esName": "Banh mi porc d'pollastre 2",
          "caName": "Chicken Banh Mi 2",
          "price": 7
        },
        {
          "name": "Banh Mi de Pollo",
          "esName": "Banh mi porc d'pollastre",
          "caName": "Chicken Banh Mi",
          "price": 6.5
        },
        {
          "name": "Banh Mi huevos y paté",
          "esName": "Banh mi ous i paté",
          "caName": "Egg Banh Mi with pate",
          "price": 6.5
        }
      ]}];
  carouselOptions: OwlOptions = {
    margin: 25,
    nav: true,
    dotsData: true,
    rewind: true,
    dots: true,
    navText: ["<div class='nav-btn prev-slide'></div>", "<div class='nav-btn next-slide'></div>"],
    responsive: {
      0: {
        items: 1,
        nav: false,
        loop: true,
      },

      600: {
        items: 1,
        nav: false,
        loop: true
      },

      1000: {
        items: 1,
        nav: true,
        loop: true
      },

      1500: {
        items: 1,
        nav: true,
        loop: true
      }
    }
  }

  products = [
    {
      name: "Yogur con argoz negro",
      esName: "Iogurt amb arròs negre",
      caName: "Yogurt with black rice",
      imageUrl: "assets/imgs/landing-page/landing-page-5.jpg"
    },
    {
      name: "Yogur con argoz negro",
      esName: "Iogurt amb arròs negre",
      caName: "Yogurt with black rice",
      imageUrl: "assets/imgs/landing-page/landing-page-6.jpg"
    },
    {
      name: "Yogur con argoz negro",
      esName: "Iogurt amb arròs negre",
      caName: "Yogurt with black rice",
      imageUrl: "assets/imgs/landing-page/landing-page-7.jpg"
    }
  ];
  
  takeAwayTitleType = '1';

  @HostListener("window:resize", ['$event']) updateDays() {
    this.setUpTittleColorBasedOnScreenSize();
    let anyService = this.carousel as any;
    let carouselService = anyService.carouselService as CarouselService; 
    carouselService.refresh();
    carouselService.update();
  }

  constructor(private store: Store, private titleService: Title) {
    this.titleService.setTitle("Little Viet - Homepage");
  }

  ngOnInit() {
    this.store.dispatch(new GetProductMenu())
    this.productMenu.subscribe((result) => {
      this.productsMenu = result;
    });
    this.setUpTittleColorBasedOnScreenSize();

  }

  setUpTittleColorBasedOnScreenSize() {
    if (window.innerWidth >= 992) {
      this.takeAwayTitleType = '1';
    } else {
      this.takeAwayTitleType = '2';
    }
  }

  clickBtn() {
    this.menuOpen = !this.menuOpen;
  }
}