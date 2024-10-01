import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { AdminUploadMenu } from 'src/app/actions/admin.action';

@Component({
  selector: 'app-menu-upload',
  templateUrl: './menu-upload.component.html',
  styleUrls: ['./menu-upload.component.scss']
})
export class MenuUploadComponent implements OnInit {
  menuFile: NzUploadFile[] = [];
  defaultMenuUrl = "https://imagelittleviettest.blob.core.windows.net/products/menu.pdf";
  pdfSrc: SafeResourceUrl | undefined;
  defaultMenu!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, private store: Store) { }

  ngOnInit(): void {
    this.defaultMenu = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultMenuUrl + '?t=' + new Date().getTime());
  }

  onSave() {
    const formData = new FormData();
    var file = this.menuFile[0] as any;
    formData.append('menu', file);
    this.store.dispatch(new AdminUploadMenu(formData));
    this.defaultMenu = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultMenuUrl + '?t=' + new Date().getTime());
    this.resetUploadData();
  }

  onCancel() {
    this.resetUploadData();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      return false;
    }

    this.menuFile = this.menuFile.concat(file);
    const originFileObj = file.originFileObj || (file as unknown as File);

    if (originFileObj) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const unsafeUrl = e.target.result;
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
      };

      reader.readAsDataURL(originFileObj); // Read the file as Data URL
    } else {
       console.error('No valid file selected.');
    }

    return false;
  };

  resetUploadData() {
    this.menuFile = [];
    this.pdfSrc = undefined;
  }
}
