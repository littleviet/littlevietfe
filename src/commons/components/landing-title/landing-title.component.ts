import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-title',
  templateUrl: './landing-title.component.html',
  styleUrls: ['./landing-title.component.scss']
})
export class LandingTitleComponent implements OnInit {
  @Input()
  title!: string;

  @Input()
  color!: string;

  constructor() { }

  ngOnInit() {
  }

}
