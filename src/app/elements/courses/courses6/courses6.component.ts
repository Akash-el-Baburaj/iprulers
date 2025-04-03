import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses6',
  templateUrl: './courses6.component.html',
  styleUrls: ['./courses6.component.css']
})
export class Courses6Component {

  constructor(private router: Router) {}

  navigateToPdf() {
    this.router.navigate(['/course-pdf'])
  }

  openLink() {
    window.open('https://example.com', '_blank');
  }
}
