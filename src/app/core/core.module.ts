import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFormatePipe } from './pipes/time-formate.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';



@NgModule({
  declarations: [
    TimeFormatePipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
