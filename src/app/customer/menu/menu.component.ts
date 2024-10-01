import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  defaultMenuUrl: string = 'https://imagelittleviettest.blob.core.windows.net/products/menu.pdf';
  pdfUrlWithTimestamp!: SafeResourceUrl;

  ngOnInit(): void {
  }

  constructor(private sanitizer: DomSanitizer) {
    this.addTimestampToPdfUrl();
  }

  addTimestampToPdfUrl() {
    this.pdfUrlWithTimestamp = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultMenuUrl + '?t=' + new Date().getTime());
  }
}
