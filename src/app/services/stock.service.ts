import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal, computed } from '@angular/core';
import { of, firstValueFrom } from 'rxjs';

export interface StockData {
  symbol: string;
  price: string;
  change: number;
  changePercent: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private platformId = inject(PLATFORM_ID);
  
  // Free API endpoint - using Yahoo Finance API (no key required)
  // Alternative: You can use Alpha Vantage API with a free key from https://www.alphavantage.co/support/#api-key
  private apiUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';
  
  // Cache for stock data
  private stockCache = signal<Map<string, StockData>>(new Map());
  
  // List of stocks to fetch
  private stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];

  /**
   * Fetch stock data for a single symbol
   */
  getStockData(symbol: string) {
    // Return fallback data immediately if not in browser (SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return of(this.getFallbackData(symbol));
    }
    
    // Yahoo Finance API doesn't support CORS from browser
    // Using fallback data to avoid CORS errors
    // For production: Use a backend proxy or a CORS-enabled API like Alpha Vantage
    return of(this.getFallbackData(symbol));
  }

  /**
   * Fetch multiple stocks at once
   */
  async getMultipleStocks(symbols: string[] = this.stockSymbols): Promise<StockData[]> {
    // Return fallback data immediately if not in browser (SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return this.getFallbackStocks(symbols);
    }
    
    try {
      // Fetch all stocks in parallel
      const requests = symbols.map(symbol => this.getStockData(symbol));
      const results = await Promise.all(requests.map(req => firstValueFrom(req)));
      
      const stockMap = new Map<string, StockData>();
      results.forEach((stock, index) => {
        if (stock) {
          stockMap.set(symbols[index], stock);
        }
      });
      this.stockCache.set(stockMap);
      return Array.from(stockMap.values());
    } catch (error) {
      // Silently fall back to fallback data
      return this.getFallbackStocks(symbols);
    }
  }

  /**
   * Get cached stock data
   */
  getCachedStocks() {
    return computed(() => Array.from(this.stockCache().values()));
  }

  /**
   * Fallback data when API fails
   */
  private getFallbackData(symbol: string): StockData {
    const fallbackPrices: { [key: string]: { price: number; change: number } } = {
      'AAPL': { price: 178.45, change: 1.23 },
      'GOOGL': { price: 142.30, change: -0.45 },
      'MSFT': { price: 378.90, change: 2.15 },
      'TSLA': { price: 248.50, change: -1.20 },
      'AMZN': { price: 145.80, change: 0.85 },
      'META': { price: 312.40, change: 1.50 },
      'NVDA': { price: 485.20, change: 3.25 },
      'BTC': { price: 42580, change: 2.80 }
    };

    const data = fallbackPrices[symbol] || { price: 100, change: 0 };
    return {
      symbol,
      price: data.price.toFixed(2),
      change: data.change,
      changePercent: data.change
    };
  }

  private getFallbackStocks(symbols: string[]): StockData[] {
    return symbols.map(symbol => this.getFallbackData(symbol));
  }
}

