import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async get<T>(key: string): Promise<T | null | undefined> {
    return this.cacheManager.get(key);
  }

  public async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  public async delete(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }

  public async listKeys(pattern: string): Promise<any> {
    if (this.cacheManager.store.keys) {
      const allKeys: string[] = await this.cacheManager.store.keys();

      return allKeys.filter((key) => key.match(pattern));
    }

    return [];
  }
}
