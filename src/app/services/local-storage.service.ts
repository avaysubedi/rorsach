import { Injectable } from '@angular/core';

import { SavedProtocol } from '../models/rorschach.models';

const STORAGE_KEY = 'rorschach-cs-protocol-draft';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  save(protocol: SavedProtocol): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(protocol));
  }

  load(): SavedProtocol | null {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved) as SavedProtocol;
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
