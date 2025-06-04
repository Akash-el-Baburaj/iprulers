import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlShareService {

  constructor() { }

  private pdfUrl: string | null = null;

  setPdfUrl(url: string) {
    this.pdfUrl = url;
  }

  getPdfUrl(): string | null {
    return this.pdfUrl;
  }

  clearPdfUrl() {
    this.pdfUrl = null;
  }
}
