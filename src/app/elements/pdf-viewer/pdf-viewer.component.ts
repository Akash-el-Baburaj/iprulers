// import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// @Component({
//   selector: 'app-pdf-viewer',
//   templateUrl: './pdf-viewer.component.html',
//   styleUrls: ['./pdf-viewer.component.css']
// })
// export class PdfViewerComponent implements AfterViewInit {
//   @Input() pdfUrl: string = 'assets/pdf/javascript_tutorial.pdf';
//   @Input() disableControls: boolean = false;
//   @ViewChild('pdfFrame', { static: false }) pdfFrame!: ElementRef<HTMLIFrameElement>;
//   sanitizedPdfUrl: SafeResourceUrl = '';

//   constructor(private sanitizer: DomSanitizer) {}

//   ngOnInit() {
//     this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0');
//   }

//   ngAfterViewInit() {
//     if (this.disableControls) {
//       this.preventDownloadPrint();
//     }
//   }

//   preventDownloadPrint() {
//     const iframe = this.pdfFrame.nativeElement;

//     // Disable Right Click
//     iframe.contentWindow?.document.addEventListener('contextmenu', (e) => e.preventDefault());

//     // Prevent Key Combinations (Ctrl+P, Ctrl+S, PrintScreen)
//     document.addEventListener('keydown', (e) => {
//       if (e.ctrlKey && (e.key === 'p' || e.key === 's')) {
//         e.preventDefault();
//         alert('Printing and saving are disabled.');
//       }
//       if (e.key === 'PrintScreen') {
//         navigator.clipboard.writeText('Screenshots are disabled.');
//       }
//     });
//   }
// }

import { Component, Input, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit {
  @Input() pdfUrl: string = 'assets/pdf/javascript_tutorial.pdf'; // PDF file URL
  @Input() disableControls: boolean = false; // Disable Download, Print, Screenshot
  @ViewChild('pdfFrame', { static: false }) pdfFrame!: ElementRef<HTMLIFrameElement>;
  sanitizedPdfUrl: SafeResourceUrl = '';

  @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
      event.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'PrintScreen') {
      navigator.clipboard.writeText(''); // Clears clipboard when PrintScreen is pressed
      alert('Screenshots are disabled!');
    }
  }

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Sanitize URL to prevent Angular security issues
    this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.pdfUrl + '#toolbar=0&navpanes=0&scrollbar=1'
    );
  }

  ngAfterViewInit() {
    if (this.disableControls) {
      this.preventDownloadPrint();
      this.preventScreenshotsAndRecording();
    }
  }

  preventDownloadPrint() {
    // Disable Right Click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Prevent Save & Print Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
        alert('Printing and saving are disabled.');
      }
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('Screenshots are disabled.');
      }
    });

    // Try hiding download options in iframe (some browsers allow it)
    const iframe = this.pdfFrame.nativeElement;
    iframe.onload = () => {
      try {
        if(iframe.contentDocument){
          iframe.contentDocument.addEventListener('contextmenu', (e) => e.preventDefault());

        }
      } catch (error) {
        console.warn('Could not access iframe content due to cross-origin restrictions.');
      }
    };
  }

  preventScreenshotsAndRecording() {
    // Hide PDF when screen recording is detected
    const observer = new MutationObserver(() => {
      if ((document as any).isScreenRecording) {
        this.pdfFrame.nativeElement.style.visibility = 'hidden';
      } else {
        this.pdfFrame.nativeElement.style.visibility = 'visible';
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['isScreenRecording'] });
  }
}

