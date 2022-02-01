import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  @Select(LandingPageState.getActions) landingActionsObs!: Observable<string[]>;
  @ViewChild('owlElement', { static: true }) carousel!: CarouselComponent;
  menuOpen: boolean = false;

  productsMenu: CustomerProductType[] = [];
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
    // let anyService = this.carousel as any;
    // let carouselService = anyService.carouselService as CarouselService; 
    // carouselService.refresh();
    // carouselService.update();
  }

  constructor(private store: Store, private titleService: Title, private route: ActivatedRoute,
    router: Router) {
    this.titleService.setTitle("Little Viet - Homepage");
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector("#" + tree.fragment);
          if (element) { element.scrollIntoView(true); }
        }
      }
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.store.dispatch(new GetProductMenu())
    this.productMenu.subscribe((result) => {
      this.productsMenu = result.filter(proType => proType.products != null && proType.products.length > 0);
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