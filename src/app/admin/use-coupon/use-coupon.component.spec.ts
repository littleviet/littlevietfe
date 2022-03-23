/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UseCouponComponent } from './use-coupon.component';

describe('UseCouponComponent', () => {
  let component: UseCouponComponent;
  let fixture: ComponentFixture<UseCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseCouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
