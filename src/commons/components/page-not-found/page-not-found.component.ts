import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  a ={
    "applinks": {
      "apps": [],
      "details": [
      {
        "appID": "5K99777NES.com.kiloloco.Universal-Linkage",
        "paths": ["/users/*"]
      }
      ]
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
