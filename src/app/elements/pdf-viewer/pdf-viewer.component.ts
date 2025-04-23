// import { Component, Input, AfterViewInit, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { ActivatedRoute } from '@angular/router';
// import { Location } from '@angular/common';
// import { ContentProtectionService } from 'src/app/core/service/content-protection.service';

// @Component({
//   selector: 'app-pdf-viewer',
//   templateUrl: './pdf-viewer.component.html',
//   styleUrls: ['./pdf-viewer.component.css']
// })
// export class PdfViewerComponent implements AfterViewInit, OnInit {
//   @Input() pdfUrl: string = 'assets/pdf/javascript_tutorial.pdf'; // PDF file URL
//   @Input() disableControls: boolean = false; // Disable Download, Print, Screenshot
//   @ViewChild('pdfFrame', { static: false }) pdfFrame!: ElementRef<HTMLIFrameElement>;
//   sanitizedPdfUrl: SafeResourceUrl = '';

//   noteData: any;

//   @HostListener('contextmenu', ['$event'])
//     onRightClick(event: MouseEvent) {
//       event.preventDefault();
//   }

  

//   @HostListener('document:keydown', ['$event'])
//   handleKeyboardEvent(event: KeyboardEvent) {
//     if (event.key === 'PrintScreen') {
//       navigator.clipboard.writeText(''); 
//       alert('Screenshots are disabled!');
//     }
//   }

//   constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private location: Location,private contentProtectionService: ContentProtectionService) {
//     this.route.queryParams.subscribe(params => {
//       if (params['data']) {
//         try {
//           this.noteData = decodeURIComponent(params['data']);
//           console.log(this.noteData);
//           this.pdfUrl = this.noteData;
//         } catch (e) {
//           console.error('Invalid note data', e);
//         }
//       }
//       this.setSanitizedUrl();
//     });
//   }
  
//   ngOnInit() {
//     document.addEventListener('contextmenu', function (e) {
//       e.preventDefault();
//     });
//     document.addEventListener('contextmenu', this.disableRightClick);

//     this.contentProtectionService.initAllProtections();
//     this.setSanitizedUrl();
//   }

//   disableRightClick(event: MouseEvent) {
//     event.preventDefault();
//   }
  
//   setSanitizedUrl() {
//     this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
//       this.pdfUrl + '#toolbar=0&navpanes=0&scrollbar=1'
//     );
//   }

//   ngAfterViewInit() {
//     // if (this.disableControls) {
//       this.preventDownloadPrint();
//       this.preventScreenshotsAndRecording();
//     // }
//   }
  
//   disableContextMenu(event: MouseEvent) {
//     event.preventDefault();
//     return false;
//   }
  
//   preventDownloadPrint() {
//     // Disable Right Click
//     document.addEventListener('contextmenu', (e) => e.preventDefault());

//     // Prevent Save & Print Shortcuts
//     document.addEventListener('keydown', (e) => {
//       if (e.ctrlKey && (e.key === 'p' || e.key === 's')) {
//         e.preventDefault();
//         alert('Printing and saving are disabled.');
//       }
//       if (e.key === 'PrintScreen') {
//         navigator.clipboard.writeText('Screenshots are disabled.');
//       }
//     });

//     // Try hiding download options in iframe (some browsers allow it)
//     const iframe = this.pdfFrame.nativeElement;
//     iframe.onload = () => {
//       try {
//         if(iframe.contentDocument){
//           iframe.contentDocument.addEventListener('contextmenu', (e) => e.preventDefault());

//         }
//       } catch (error) {
//         console.warn('Could not access iframe content due to cross-origin restrictions.');
//       }
//     };
//   }

//   preventScreenshotsAndRecording() {
//     // Hide PDF when screen recording is detected
//     const observer = new MutationObserver(() => {
//       if ((document as any).isScreenRecording) {
//         this.pdfFrame.nativeElement.style.visibility = 'hidden';
//       } else {
//         this.pdfFrame.nativeElement.style.visibility = 'visible';
//       }
//     });

//     observer.observe(document.body, { attributes: true, attributeFilter: ['isScreenRecording'] });
//   }

//   goBack(): void {
//     this.location.back();
//   }


//   @HostListener('document:visibilitychange', [])
// onVisibilityChange() {
//   if (document.hidden) {
//     this.pdfFrame.nativeElement.style.visibility = 'hidden';
//   } else {
//     this.pdfFrame.nativeElement.style.visibility = 'visible';
//   }
// }
// @HostListener('window:keyup', ['$event'])
// onKeyUp(event: KeyboardEvent) {
//   if (event.key === 'PrintScreen') {
//     navigator.clipboard.writeText('');
//     this.pdfFrame.nativeElement.style.visibility = 'hidden';
//     alert('Screenshots are disabled!');
//     setTimeout(() => {
//       this.pdfFrame.nativeElement.style.visibility = 'visible';
//     }, 3000);
//   }
// }

// @HostListener('document:keydown', ['$event'])
//   onKeyDown(event: KeyboardEvent) {
//     if ((event.ctrlKey || event.metaKey) && ['p', 's'].includes(event.key)) {
//       event.preventDefault();
//       alert('Print and Save are disabled.');
//     }
//     if (event.key === 'PrintScreen') {
//       navigator.clipboard.writeText('');
//       alert('Screenshots are disabled.');
//     }
//   }


// }

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

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit, OnInit {
  @Input() pdfUrl: string = 'assets/pdf/javascript_tutorial.pdf';
  @ViewChild('pdfFrame', { static: false }) pdfFrame!: ElementRef<HTMLIFrameElement>;
  sanitizedPdfUrl: SafeResourceUrl = '';
  noteData: any;
  pages: number[] = [];
  pdfDoc: any;

  scaleMode: 'fit' | 'original' = 'fit';

  // @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('pdfCanvas') pdfCanvas!: QueryList<ElementRef<HTMLCanvasElement>>;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private location: Location,
    private contentProtectionService: ContentProtectionService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          this.noteData = decodeURIComponent(params['data']);
          this.pdfUrl = this.noteData;
        } catch (e) {
          console.error('Invalid note data', e);
        }
      }
      this.setSanitizedUrl();
    });
  }
  ngAfterViewInit(): void {
    this.loadPdf(this.pdfUrl);
    }

  ngOnInit() {
    document.addEventListener('contextmenu', this.disableRightClick);
    this.contentProtectionService.initAllProtections();
    this.setSanitizedUrl();
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
  this.scaleMode = this.scaleMode === 'fit' ? 'original' : 'fit';
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
