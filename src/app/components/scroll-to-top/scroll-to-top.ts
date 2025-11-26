import { Component, signal, afterNextRender, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss'
})
export class ScrollToTop implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  isVisible = signal(false);
  private scrollListener?: () => void;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.scrollListener = () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          this.isVisible.set(scrollTop > 300);
        };
        window.addEventListener('scroll', this.scrollListener);
        // Check initial scroll position
        this.scrollListener();
      });
    }
  }

  ngOnDestroy() {
    if (this.scrollListener && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}

