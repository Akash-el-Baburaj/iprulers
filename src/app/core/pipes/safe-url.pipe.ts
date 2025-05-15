import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    const urls: any = this.sanitizer.sanitize(SecurityContext.URL, url);

    return this.sanitizer.bypassSecurityTrustResourceUrl(urls);
  }
}
