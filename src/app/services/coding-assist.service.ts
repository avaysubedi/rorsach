import { Injectable } from '@angular/core';

import {
  FqEntry,
  FqSymbol,
  PopularEntry,
  ReferenceCitation
} from '../models/rorschach.models';

export interface ScoredFqHit {
  entry: FqEntry;
  confidence: number;
}

export interface ScoredPopularHit {
  entry: PopularEntry;
  confidence: number;
  source: ReferenceCitation;
}

const SYMBOL_TO_FQ: Record<FqSymbol, string> = {
  '+': 'FQ+',
  o: 'FQo',
  u: 'FQu',
  '-': 'FQ-'
};

@Injectable({ providedIn: 'root' })
export class CodingAssistService {
  formQualityValue(symbol: FqSymbol): string {
    return SYMBOL_TO_FQ[symbol];
  }

  searchFormQuality(entries: FqEntry[], card: string, query: string, locationCodes: string[]): ScoredFqHit[] {
    const normalizedQuery = this.normalize(query);
    if (!card || normalizedQuery.length < 2) {
      return [];
    }

    const hits = entries
      .filter((entry) => entry.card === card)
      .map((entry) => ({
        entry,
        confidence: this.confidence(entry, normalizedQuery, locationCodes)
      }))
      .filter((hit) => hit.confidence >= 45)
      .sort((a, b) => b.confidence - a.confidence || b.entry.label.length - a.entry.label.length);

    return hits.slice(0, 8);
  }

  matchPopular(entries: PopularEntry[], card: string, query: string, locationCodes: string[]): ScoredPopularHit | null {
    const normalizedQuery = this.normalize(query);
    if (!card || normalizedQuery.length < 2) {
      return null;
    }

    const hits = entries
      .filter((entry) => entry.card === card)
      .filter((entry) => !entry.locationCode || !locationCodes.length || locationCodes.includes(entry.locationCode))
      .map((entry) => {
        const best = Math.max(
          ...entry.matchLabels.map((label) => this.textScore(normalizedQuery, this.normalize(label))),
          0
        );
        const locationMultiplier = !entry.locationCode || !locationCodes.length
          ? 0.85
          : locationCodes.includes(entry.locationCode) ? 1 : 0.6;
        return {
          entry,
          confidence: Math.round(100 * best * locationMultiplier),
          source: entry.citation
        };
      })
      .filter((hit) => hit.confidence >= 45)
      .sort((a, b) => b.confidence - a.confidence);

    return hits[0] ?? null;
  }

  locationHints(entries: FqEntry[], card: string, locationCodes: string[]): FqEntry[] {
    if (!card || !locationCodes.length) {
      return [];
    }
    const seen = new Set<string>();
    const hints: FqEntry[] = [];
    for (const entry of entries) {
      if (entry.card !== card || !locationCodes.includes(entry.locationCode) || seen.has(entry.label)) {
        continue;
      }
      seen.add(entry.label);
      hints.push(entry);
      if (hints.length === 5) {
        break;
      }
    }
    return hints;
  }

  private confidence(entry: FqEntry, normalizedQuery: string, locationCodes: string[]): number {
    const labels = [entry.label, ...(entry.aliases ?? [])];
    const best = Math.max(...labels.map((label) => this.textScore(normalizedQuery, this.normalize(label))), 0);
    if (best <= 0) {
      return 0;
    }
    return Math.round(100 * best * this.locationMultiplier(entry.locationCode, locationCodes));
  }

  private locationMultiplier(locationCode: string, locationCodes: string[]): number {
    if (!locationCodes.length) {
      return 0.85;
    }
    if (locationCodes.includes(locationCode)) {
      return 1;
    }
    return 0.6;
  }

  private textScore(query: string, label: string): number {
    if (!query || !label) {
      return 0;
    }
    if (query === label) {
      return 1;
    }
    const queryTokens = query.split(' ').filter(Boolean);
    const labelTokens = label.split(' ').filter(Boolean);
    if (queryTokens.some((token) => labelTokens.includes(token)) || labelTokens.some((token) => queryTokens.includes(token))) {
      return 0.92;
    }
    if (queryTokens.some((token) => token.length >= 3 && labelTokens.some((labelToken) => labelToken.startsWith(token) || token.startsWith(labelToken)))) {
      return 0.75;
    }
    const distance = this.bestTokenDistance(queryTokens, labelTokens);
    if (distance === 1) {
      return 0.7;
    }
    if (distance === 2) {
      return 0.55;
    }
    return 0;
  }

  private bestTokenDistance(queryTokens: string[], labelTokens: string[]): number {
    let best = Number.POSITIVE_INFINITY;
    for (const queryToken of queryTokens) {
      for (const labelToken of labelTokens) {
        const limit = labelToken.length >= 8 || queryToken.length >= 8 ? 2 : 1;
        if (queryToken.length < 4 && labelToken.length < 4) {
          continue;
        }
        const distance = this.editDistance(queryToken, labelToken, limit);
        if (distance >= 0 && distance < best) {
          best = distance;
        }
      }
    }
    return best;
  }

  private editDistance(a: string, b: string, limit: number): number {
    if (Math.abs(a.length - b.length) > limit) {
      return -1;
    }
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      let rowBest = row[0];
      for (let j = 1; j <= b.length; j += 1) {
        const current = row[j];
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + cost);
        previous = current;
        rowBest = Math.min(rowBest, row[j]);
      }
      if (rowBest > limit) {
        return -1;
      }
    }
    return row[b.length] <= limit ? row[b.length] : -1;
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
