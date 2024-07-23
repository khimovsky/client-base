import { inject, Injectable } from '@angular/core';
import { CacheConfigService } from './cache-config.service';

export interface CacheService {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  clearCache(key: string): void;
  isCacheValid(key: string | null): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageCacheService implements CacheService {
  private readonly cacheConfigService = inject(CacheConfigService);

  getItem<T>(key: string): T | null {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;
    return JSON.parse(cachedData) as T;
  }

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(`${key}_time`, Date.now().toString());
  }

  clearCache(key: string): void {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_time`);
  }

  isCacheValid(cacheTime: string | null): boolean {
    if (!cacheTime) return false;
    return (Date.now() - parseInt(cacheTime)) < this.cacheConfigService.cacheDuration;
  }
}
