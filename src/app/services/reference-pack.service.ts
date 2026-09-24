import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ReferencePack } from '../models/rorschach.models';

@Injectable({ providedIn: 'root' })
export class ReferencePackService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);

  pack: ReferencePack | null = null;
  loadState: 'loading' | 'ready' | 'missing' = 'loading';

  load(): void {
    this.http.get<ReferencePack>('assets/data/reference-pack.json').subscribe({
      next: (pack) => {
        if (!this.isPack(pack)) {
          this.pack = null;
          this.loadState = 'missing';
          this.snackBar.open('Reference pack could not be read. Coding stays manual.', 'Dismiss', { duration: 4000 });
          return;
        }
        this.pack = pack;
        this.loadState = 'ready';
      },
      error: () => {
        this.pack = null;
        this.loadState = 'missing';
        this.snackBar.open('No reference pack loaded. Form Quality stays manual.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  private isPack(value: ReferencePack): boolean {
    return value?.schemaVersion === 1 && !!value.datasets && typeof value.citation === 'string';
  }
}
