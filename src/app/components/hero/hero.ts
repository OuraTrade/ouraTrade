import { Component, signal, inject, OnInit, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockService, StockData } from '../../services/stock.service';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit, OnDestroy {
  private stockService = inject(StockService);
  
  stocks = signal<StockData[]>([]);
  isLoading = signal(false);

  floatingData = signal([
    { value: '+12.5%', label: 'Growth', position: 1 },
    { value: '$2.4M', label: 'Volume', position: 2 },
    { value: '1,250+', label: 'Trades', position: 3 },
    { value: '98.5%', label: 'Success', position: 4 }
  ]);

  // Array for particles
  particleArray = Array(20).fill(0);

  // Stock symbols to display
  private stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];
  private refreshInterval: any;

  // Rotating services text
  services = ['Account Management', 'Copy Trading', 'Trading Consultations'];
  currentServiceIndex = signal(0);
  isRotating = signal(false);
  private serviceInterval: any;

  constructor() {
    // Initialize with fallback data immediately
    this.stocks.set(this.getFallbackStocks());
    
    // Use afterNextRender to ensure this only runs in the browser
    afterNextRender(() => {
      this.loadStockData();
      // Refresh stock data every 30 seconds
      this.refreshInterval = setInterval(() => this.loadStockData(), 30000);
      // Start rotating services text
      this.startServiceRotation();
    });
  }

  ngOnInit() {
    // Component initialization - data already set in constructor
  }

  ngOnDestroy() {
    // Clean up intervals
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.serviceInterval) {
      clearInterval(this.serviceInterval);
    }
  }

  startServiceRotation() {
    // Rotate services every 3 seconds
    this.serviceInterval = setInterval(() => {
      this.isRotating.set(true);
      setTimeout(() => {
        this.currentServiceIndex.update(index => (index + 1) % this.services.length);
        this.isRotating.set(false);
      }, 300); // Half of animation duration
    }, 3000);
  }

  getCurrentService(): string {
    return this.services[this.currentServiceIndex()];
  }

  async loadStockData() {
    try {
      this.isLoading.set(true);
      const stockData = await this.stockService.getMultipleStocks(this.stockSymbols);
      this.stocks.set(stockData);
    } catch (error) {
      console.error('Error loading stock data:', error);
      // Use fallback data
      this.stocks.set(this.getFallbackStocks());
    } finally {
      this.isLoading.set(false);
    }
  }

  private getFallbackStocks(): StockData[] {
    return [
      { symbol: 'AAPL', price: '178.45', change: 1.23, changePercent: 1.23 },
      { symbol: 'GOOGL', price: '142.30', change: -0.45, changePercent: -0.45 },
      { symbol: 'MSFT', price: '378.90', change: 2.15, changePercent: 2.15 },
      { symbol: 'TSLA', price: '248.50', change: -1.20, changePercent: -1.20 },
      { symbol: 'AMZN', price: '145.80', change: 0.85, changePercent: 0.85 },
      { symbol: 'META', price: '312.40', change: 1.50, changePercent: 1.50 },
      { symbol: 'NVDA', price: '485.20', change: 3.25, changePercent: 3.25 }
    ];
  }
}
