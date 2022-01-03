import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss']
})
export class HamburgerButtonComponent implements OnInit {
  menuOpen : boolean = false;
  constructor() { }

  ngOnInit() {
  }

  clickBtn() {
    console.log("shit");
    this.menuOpen = !this.menuOpen;
  }

}
