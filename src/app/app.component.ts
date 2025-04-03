import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iprulers';
  isProtected = false;

  // @HostListener('contextmenu', ['$event'])
  // onRightClick(event: Event) {
  //   event.preventDefault();
  //   this.showWarning();
  // }

  // @HostListener('document:keyup', ['$event'])
  // onKeyUp(event: KeyboardEvent) {
  //   const screenshotKeys = ['PrintScreen', 'PrtScn', 'Snapshot'];
  //   if (screenshotKeys.includes(event.key)) {
  //     this.showWarning();
  //     this.clearClipboard();
  //   }
  // }

  // @HostListener('document:keydown', ['$event'])
  // onKeyDown(event: KeyboardEvent) {
  //   if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
  //     event.preventDefault();
  //     this.showWarning();
  //   }
  // }

  // @HostListener('touchstart', ['$event'])
  // onTouchStart(event: TouchEvent) {
  //   if (event.touches.length > 1) { /
  //     this.showWarning();
  //   }
  // }

  // showWarning() {
  //   this.isProtected = true;
  //   setTimeout(() => {
  //     this.isProtected = false;
  //   }, 2000); 
  // }

  // async clearClipboard() {
  //   try {
  //     await navigator.clipboard.writeText('');
  //   } catch (err) {
  //     console.error('Clipboard clear failed:', err);
  //   }
  // }
}
