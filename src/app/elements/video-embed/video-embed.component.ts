import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from 'src/app/core/service/course.service';
import { ToastService } from 'src/app/core/service/services/toast.service';

@Component({
  selector: 'app-video-embed',
  templateUrl: './video-embed.component.html',
  styleUrls: ['./video-embed.component.css']
})
export class VideoEmbedComponent implements OnChanges, OnInit {


  @Input() VideoURL: SafeResourceUrl | null = '';
  @Input() VideoType: string = '';
  @Input() videoId: any ;
  @Output() VideoCompleted = new EventEmitter<any>(); 
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;

  videoEmbedUrl: SafeResourceUrl | null = '';
  videoEmbedType: string | null = '';
  duration: number | null = null;
  isLoading: boolean = true;
  isVideoWatched: boolean = false;
  enrolled_id:any;
  video_id:any;
  


  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['VideoURL']) {
      this.videoEmbedUrl = this.VideoURL;
      this.videoEmbedType = this.VideoType
      this.video_id = this.videoId     
    }
  }

  

  ngOnInit(): void {
    this.enrolled_id=localStorage.getItem('enrolled_id')
    this.videoEmbedUrl = this.VideoURL;
    this.videoEmbedType = this.VideoType;
    // this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
    
  }
  constructor(
      private courseService: CourseService,
          private toastr: ToastService,
      
      
    ) {

    }

  onMetadataLoaded(video: HTMLVideoElement): void {
    this.duration = video.duration;  
    const hours = Math.floor(this.duration / 3600); 
    const minutes = Math.floor((this.duration % 3600) / 60); 
    const seconds = Math.floor(this.duration % 60); 
  }
  
  onVideoEnded(video: HTMLVideoElement): void {
    video.autoplay = false; // Stop autoplay after the first play

  }

  onVideoCanPlay(): void {
    this.isLoading = false; // Hide the loader when the video is ready
  }

  onTimeUpdate(video: HTMLVideoElement): void {
    const threshold = 0.90; // 90% watched threshold
    const watchedPercentage = video.currentTime / video.duration;

    if (watchedPercentage >= threshold && !this.isVideoWatched) {
      this.isVideoWatched = true;  
    }
  }
}
