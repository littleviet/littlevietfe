import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, ResolveEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { filter } from 'rxjs';
import { AutoLogin } from './actions/authentication.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new AutoLogin());
  }

}
