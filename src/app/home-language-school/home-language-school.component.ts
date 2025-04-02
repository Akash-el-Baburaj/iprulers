import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home-language-school',
  templateUrl: './home-language-school.component.html',
  styleUrls: ['./home-language-school.component.css']
})
export class HomeLanguageSchoolComponent {

  scrollToCourses() {
    const element = document.getElementById('coursesSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
}
