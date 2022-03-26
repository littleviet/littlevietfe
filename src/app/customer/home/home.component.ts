import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { GetProductMenu } from 'src/app/actions/landing-page.action';
import { LandingPageState } from 'src/app/states/landing-page.state';
import { LandingPageModel } from 'src/dtos/landing-page/landing-page-model';
import { CustomerProductType } from 'src/dtos/product-type/customer-product-type';
import { CusPackagedProduct } from 'src/dtos/product/cus-packaged-product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(LandingPageState.getLandingPageModel) landingPageModelObs!: Observable<LandingPageModel>;
  @Select(LandingPageState.getActions) landingActionsObs!: Observable<string[]>;
  @ViewChild('owlElement', { static: true }) carousel!: CarouselComponent;
  @ViewChild('footer') footerEl!: ElementRef;
  menuOpen: boolean = false;
  footerHeight: number = 0;
  landingPageModel: LandingPageModel | null = null;
  productsMenu: CustomerProductType[] = [];
  packagedProducts: CusPackagedProduct[] = []
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
  
  takeAwayTitleType = '1';

  @HostListener("window:resize", ['$event']) updateDays() {
    this.setUpTittleColorBasedOnScreenSize();
  }

  constructor(private store: Store, private titleService: Title, private route: ActivatedRoute,
    router: Router, private cdRef : ChangeDetectorRef) {
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

  ngAfterViewChecked() {
    this.footerHeight = this.footerEl.nativeElement.getBoundingClientRect().height;
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.store.dispatch(new GetProductMenu());
    this.landingPageModelObs.subscribe((result) => {
      this.landingPageModel = result;
      if (this.landingPageModel != null) {
        this.productsMenu = this.landingPageModel.menuProducts.filter(proType => proType.products != null && proType.products.length > 0);
        this.packagedProducts = this.landingPageModel.packagedProducts;
      } else {
        this.productsMenu = [];
        this.packagedProducts = [];
      }
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
