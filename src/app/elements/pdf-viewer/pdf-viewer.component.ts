import {
  Component, Input, AfterViewInit, ViewChild, ElementRef, HostListener, OnInit,
  ViewChildren,
  QueryList
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ContentProtectionService } from 'src/app/core/service/content-protection.service';
import * as pdfjsLib from 'pdfjs-dist';
import { UrlShareService } from 'src/app/core/service/url-share.service';
import { AlertService } from 'src/app/core/service/services/alert.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit, OnInit {
  @Input() pdfUrl: string | null = null;
  @ViewChild('pdfFrame', { static: false }) pdfFrame!: ElementRef<HTMLIFrameElement>;
  sanitizedPdfUrl: SafeResourceUrl = '';
  noteData: any;
  pages: number[] = [];
  pdfDoc: any;
  isLoading: boolean = false;
  scaleMode: 'fit' | 'original' = 'original';
  user: any;
  // @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('pdfCanvas') pdfCanvas!: QueryList<ElementRef<HTMLCanvasElement>>;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private location: Location,
    private contentProtectionService: ContentProtectionService,
    private pdfService: UrlShareService,
    private alertService: AlertService, 
    private authService: AuthenticationService
  ) {
    // this.route.queryParams.subscribe(params => {
    //   if (params['data']) {
    //     try {
    //       this.noteData = decodeURIComponent(params['data']);
    //       this.pdfUrl = this.noteData;
    //     } catch (e) {
    //       console.error('Invalid note data', e);
    //     }
    //   }
    //   this.setSanitizedUrl();
    // });
  }
  ngAfterViewInit(): void {
    this.isLoading = true;
    if (this.pdfUrl) {
      this.loadPdf(this.pdfUrl);
    }
    }

  ngOnInit() {
    document.addEventListener('contextmenu', this.disableRightClick);
    this.contentProtectionService.initAllProtections();
    this.pdfUrl = this.pdfService.getPdfUrl();
    this.setSanitizedUrl();
    this.getProfile()
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


  disableRightClick(event: MouseEvent): void {
    event.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
handleKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey && (event.key === 'p' || event.key === 's')) || event.key === 'PrintScreen') {
    event.preventDefault();
  }
}

async loadPdf(url: string) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const loadingTask = pdfjsLib.getDocument({ url });
  this.pdfDoc = await loadingTask.promise;

  this.pages = Array.from({ length: this.pdfDoc.numPages }, (_, i) => i + 1);
  this.isLoading = false;
  this.renderAllPages();
}

async renderAllPages() {
  setTimeout(() => {
    this.pdfCanvas.forEach(async (canvasRef, index) => {
      const page = await this.pdfDoc.getPage(index + 1);
      const canvas = canvasRef.nativeElement;
      const context = canvas.getContext('2d')!;

      const scale = this.scaleMode === 'fit' ? 1 : 1.5;
      const viewport = page.getViewport({ scale });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
      // Fit mode uses 100% width and auto height
      if (this.scaleMode === 'fit') {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
      } else {
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
      }
    });
  }, 0);
}

toggleScaleMode() {
  this.scaleMode = this.scaleMode === 'original' ? 'original' : 'original';
  this.renderAllPages();
}

// async loadPdf(url: string) {
//   pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

//   const loadingTask = pdfjsLib.getDocument({ url });
//   const pdf = await loadingTask.promise;

//   this.pages = Array.from({ length: pdf.numPages }, (_, i) => i + 1);

//   // Wait for canvas list to render in DOM
//   setTimeout(() => {
//     this.pdfCanvas.forEach(async (canvasRef, index) => {
//       const canvas = canvasRef.nativeElement;
//       const context = canvas.getContext('2d')!;
//       const page = await pdf.getPage(index + 1);
//       const viewport = page.getViewport({ scale: 1.5 });

//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       await page.render({
//         canvasContext: context,
//         viewport
//       }).promise;
//     });
//   }, 0);
// }


  // In your component
@HostListener('contextmenu', ['$event'])
onRightClick(event: MouseEvent): void {
  event.preventDefault();
}

@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
  // Block Ctrl+S/Cmd+S, Ctrl+P/Cmd+P
  if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'p')) {
    event.preventDefault();
  }
}

  setSanitizedUrl() {
    this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.pdfUrl + '#toolbar=0&navpanes=0&scrollbar=1'
    );
  }

  goBack(): void {
    this.location.back();
  }

  disableContextMenu(event: MouseEvent) {
    event.preventDefault();
    return false;
  }



  
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'p')) {
      event.preventDefault();
    }
    if (event.key === 'PrintScreen') {
      event.preventDefault();
    }
  }
}
