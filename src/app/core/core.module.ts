import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFormatePipe } from './pipes/time-formate.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SortPipe } from './pipes/sort.pipe';



@NgModule({
  declarations: [
    TimeFormatePipe,
    SafeUrlPipe,
    SortPipe
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
