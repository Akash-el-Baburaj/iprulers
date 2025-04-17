import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/core/service/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cources-details',
  templateUrl: './cources-details.component.html',
  styleUrls: ['./cources-details.component.css']
})
export class CourcesDetailsComponent implements OnInit {
  
  banner : any = {
		pagetitle: "Courses Details",
		bg_image: "assets/images/banner/bnr-6.png",
		title: "Courses Details",
	}
  page: number = 1;
  myCourseList: any[] = [];
  myMaterialList: any[] = [];
  selectedCourse: any;

  constructor(private courseService: CourseService,private router: Router) {}

  ngOnInit(): void {
    this.getMyCourseList();
  }

  getMyCourseList() {
    this.courseService.getCourseList(this.page).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.myCourseList = res.data.courses;
          this.myMaterialList = res.data.materials;
        }
      }
    })
  }

  viewCourse(event: any){ 
    console.log('selected course => ',event.course_id);
    const ID = event.course_id;
    this.getCOurseById(ID);
  }

  getCOurseById(id: string) {
    this.courseService.getCourseById(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.selectedCourse = res.data;
          console.log('course by ID => ', res)
        }
      }
    })
  }
  navigateToPdf(pdfUrl: string) {
    const encodedData = encodeURIComponent(pdfUrl)
    this.router.navigate(['/course-pdf'], { queryParams: { data: encodedData } })
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
