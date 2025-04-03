import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iprulers';
  isProtected = false;

  // Detect right-click (context menu)
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event) {
    event.preventDefault();
    this.showWarning();
  }

  // Detect common screenshot-related keys
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const screenshotKeys = ['PrintScreen', 'PrtScn', 'Snapshot'];
    if (screenshotKeys.includes(event.key)) {
      this.showWarning();
      this.clearClipboard();
    }
  }

  // Detect Ctrl+P (print) or Cmd+P
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      this.showWarning();
    }
  }

  // Detect touch events (for mobile devices)
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) { // Multi-touch might indicate screenshot gesture
      this.showWarning();
    }
  }

  // Show a warning overlay
  showWarning() {
    this.isProtected = true;
    setTimeout(() => {
      this.isProtected = false;
    }, 2000); // Hide after 2 seconds
  }

  // Attempt to clear clipboard (works in some browsers)
  async clearClipboard() {
    try {
      await navigator.clipboard.writeText('');
    } catch (err) {
      console.error('Clipboard clear failed:', err);
    }
  }
}
