import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PhoneMaskDirective } from './directives/phone-mask.directive';

@NgModule({
  declarations: [
    PhoneMaskDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PhoneMaskDirective
  ],
})
export class SharedModule {
}