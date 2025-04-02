import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-form2',
  templateUrl: './search-form2.component.html',
  styleUrls: ['./search-form2.component.css']
})
export class SearchForm2Component {
  @Output() scrollToCourses = new EventEmitter<void>();

  onScrollToCourses() {
    this.scrollToCourses.emit();
  }
}
