/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PickUpOrderComponent } from './pick-up-order.component';

describe('PickUpOrderComponent', () => {
  let component: PickUpOrderComponent;
  let fixture: ComponentFixture<PickUpOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickUpOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickUpOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
