import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentProtectionService {
  private renderer!: Renderer2;


  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  disableContextMenu(): void {
    this.renderer.listen('document', 'contextmenu', (event) => {
      event.preventDefault();
    });
  }

  blockKeyCombinations(): void {
    this.renderer.listen('document', 'keydown', (event) => {
      const key = event.key.toLowerCase();
      if (
        (event.ctrlKey && ['s', 'p', 'u', 'c'].includes(key)) || // save, print, view source, copy
        (event.key === 'F12') // dev tools
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  preventPrint(): void {
    const style = this.renderer.createElement('style');
    style.textContent = `@media print { body { display: none !important; } }`;
    this.renderer.appendChild(document.head, style);
  }

  initAllProtections(): void {
    this.disableContextMenu();
    this.blockKeyCombinations();
    this.preventPrint();
  }}
