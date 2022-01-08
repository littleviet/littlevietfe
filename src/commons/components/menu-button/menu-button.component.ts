import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {
  @Input() isDisplayBackground: boolean = false
  @Output() isMenuOpen: EventEmitter<boolean> = new EventEmitter();
  menuOpen: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  clickBtn() {
    this.menuOpen = !this.menuOpen;
    console.log(this.menuOpen);
    this.isMenuOpen.emit(this.menuOpen);
  }

}
