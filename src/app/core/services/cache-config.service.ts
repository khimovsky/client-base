import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheConfigService {
  private readonly CACHE_KEY = 'usersCache';
  private readonly CACHE_DURATION = 1000 * 60 * 5;

  get cacheKey(): string {
    return this.CACHE_KEY;
  }

  get cacheDuration(): number {
    return this.CACHE_DURATION;
  }
}
