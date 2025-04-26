import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CourseService } from 'src/app/core/service/course.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AlertService } from 'src/app/core/service/services/alert.service';

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
  videoId = 'YOUR_VIDEO_ID';
  vimeoUrl: string = '';
  videoPlayerOpen: boolean = false;
  VideoType: string = '';
  videoEmbedUrl: any;
  courseVideo: any;

  selectedModuleIndex: number | null = null;
  selectedSessionIndex: number | null = null;


  @ViewChild('mediaDiv') mediaDiv!: ElementRef;
  selectedModuleId: string = '';
  selectedSessionId: string = '';

  duration: number | null = null;
  isLoading: boolean = false;
  isVideoWatched: boolean = false;
  SelectedCourseName: any;

  user: any;

  constructor(private courseService: CourseService,private router: Router, private alertService: AlertService, private sanitizer: DomSanitizer, private authService: AuthenticationService) {
      }

  ngOnInit(): void {
    this.getProfile();
    this.getMyCourseList();
  }

  getMyCourseList() {
    this.isLoading = true;
    this.courseService.getCourseList(this.page).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.myCourseList = res.data.courses;
          this.myMaterialList = res.data.materials;
          this.isLoading = false;
        } else if (res.message.includes('Invalid user')) {
          this.alertService.warn('Signed Out!', 'You have been signed out because your account was accessed from another device.');
          this.isLoading = false;
          this.authService.forceLogout();
        }
      }
    })
  }

  getProfile() {
    this.authService.getUserProfile().subscribe({
      next: (res: any) => {
        this.user = res.data;
        if (res.message.includes('Invalid user')) {
          this.alertService.warn('Signed Out!', 'You have been signed out because your account was accessed from another device.');
          this.authService.forceLogout();
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
    this.isLoading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.selectedCourse = res.data;
          this.SelectedCourseName = this.selectedCourse.course.title
          this.isLoading = false;
        } else if (res.message.includes('Invalid user')) {
          this.alertService.warn('Signed Out!', 'You have been signed out because your account was accessed from another device.');
          this.authService.forceLogout();
        }
      }
    })
  }
  navigateToPdf(pdfUrl: string) {
    const encodedData = encodeURIComponent(pdfUrl)
    this.router.navigate(['/course-pdf'], { queryParams: { data: encodedData } })
  }

  // navigateToPdf(pdfUrl: string) {
  //   const encodedData = encodeURIComponent(pdfUrl);
  //   const url = this.router.serializeUrl(
  //     this.router.createUrlTree(['/course-pdf'], { queryParams: { data: encodedData } })
  //   );
  //   const fullUrl = `${window.location.origin}${url}`;
  //   window.open(fullUrl, '_blank');
  // }
  

  openLink(link: string) {
    window.open(link, '_blank');
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../../assets/images/default-profile.png';
  }
  // playVideo(url: string, module: string, session: string) {
  //   this.selectedModuleId = module;
  //   this.selectedSessionId = session;
  //   this.vimeoUrl = '';
  //   this.videoPlayerOpen = true;
  //   if (url) {
  //     this.vimeoUrl = url;
  //     this.getCourseVideo(this.vimeoUrl, true);
  //   }
  // }

  // playVideo(url: string, moduleId: string, sessionId: string) {
  //   // Update selection
  //   this.selectedModuleId = moduleId;
  //   this.selectedSessionId = sessionId;
  
  //   // Reset vimeoUrl temporarily to trigger change detection
  //   if (this.vimeoUrl === '') {
  //     this.vimeoUrl = '';
  //     setTimeout(() => {
  //       this.vimeoUrl = url;
  //       this.getCourseVideo(url, true);
  //     }, 50);
  //   } else {
  //     this.vimeoUrl = url;
  //     this.getCourseVideo(url, true);
  //   }
  
  //   this.videoPlayerOpen = true;
  // }
  playVideo(url: string, title: string, moduleId: string, sessionId: string) {
    this.selectedModuleId = moduleId;
    this.selectedSessionId = sessionId;
    this.SelectedCourseName = title;
    this.videoPlayerOpen = true;
    this.vimeoUrl = '';
    this.VideoType = url.includes('vimeo.com') ? 'vimeo' : 'server';
    this.vimeoUrl = url;
    if(this.vimeoUrl) {
      setTimeout(() => {
        if (this.mediaDiv?.nativeElement) {
          const element = this.mediaDiv.nativeElement;
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          const offset = 75; 
          const targetPosition = elementTop - offset;
  
          const finalPosition = Math.max(0, targetPosition);
  
          window.scrollTo({
            top: finalPosition,
            behavior: 'smooth'
          });
        }
      }, 0); 
    }
  }
  

  get videoType(): 'youtube' | 'vimeo' | 'server' {
    if (this.vimeoUrl.includes('youtube.com') || this.vimeoUrl.includes('youtu.be')) return 'youtube';
    if (this.vimeoUrl.includes('vimeo.com')) return 'vimeo';
    return 'server';
  }

  get embedUrl(): string {
    if (this.videoType === 'youtube') {
      const videoId = this.vimeoUrl.split('v=')[1]?.split('&')[0] || this.vimeoUrl.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&controls=1`;
    }
    if (this.videoType === 'vimeo') {
      const videoId = this.vimeoUrl.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return '';
  }
  

 
  }
