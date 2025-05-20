import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses6',
  templateUrl: './courses6.component.html',
  styleUrls: ['./courses6.component.css']
})
export class Courses6Component implements OnChanges {

  @Input() course: any;

  myCourse: any | null = null;

  constructor(private router: Router) {}
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseList']) {
      this.myCourse = this.course;
    }
  }

  navigateToPdf() {
    this.router.navigate(['/course-pdf'])
  }

  openLink() {
    window.open('https://example.com', '_blank');
  }
}
