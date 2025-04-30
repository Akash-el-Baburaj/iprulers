import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-recent-posts1',
  templateUrl: './recent-posts1.component.html',
  styleUrls: ['./recent-posts1.component.css']
})
export class RecentPosts1Component implements OnChanges {

  @Input() courseList: any[] = [];
  @Output() courseSelected = new EventEmitter<any>(); 

  selectedCourseId: string | null = null;
  
  myCourses: any[] = [];

  constructor() {}
   
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseList']) {
      this.myCourses = this.courseList;
    }
  }

  // viewCourse(id: string) {
  //   this.courseSelected.emit({course_id: id})
  // }

  viewCourse(id: string) {
    this.selectedCourseId = id;
    this.courseSelected.emit({ course_id: id });
  }
  



}
