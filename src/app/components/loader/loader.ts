import { Component, signal, PLATFORM_ID, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  isLoading = signal(true);
  private loadHandler?: () => void;
  private startTime = Date.now();
  private minDisplayTime = 1500; // 1.5 seconds minimum

  constructor() {
    // Show loader immediately in constructor (before ngOnInit)
    if (isPlatformBrowser(this.platformId)) {
      this.isLoading.set(true);
      this.startTime = Date.now();
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadHandler = () => {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minDisplayTime - elapsed);
        
        setTimeout(() => {
          // Hide the initial static loader from index.html
          const initialLoader = document.getElementById('initial-loader');
          if (initialLoader) {
            initialLoader.classList.add('hidden');
            // Remove it from DOM after transition
            setTimeout(() => {
              initialLoader.remove();
            }, 600);
          }
          
          // Hide Angular loader
          this.isLoading.set(false);
          
          // Show app content - remove inline styles and add loaded class
          const appRoot = document.querySelector('app-root') as HTMLElement;
          if (appRoot) {
            appRoot.style.opacity = '1';
            appRoot.style.visibility = 'visible';
            appRoot.classList.add('loaded');
          }
        }, remaining);
      };

      // Store handler in local variable for TypeScript
      const handler = this.loadHandler;

      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        // Check if page is already loaded
        if (document.readyState === 'complete') {
          handler();
        } else {
          // Wait for page to fully load
          window.addEventListener('load', handler);
        }
      }, 50);
    } else {
      // For SSR, hide immediately
      this.isLoading.set(false);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.loadHandler) {
      window.removeEventListener('load', this.loadHandler);
    }
  }
}

