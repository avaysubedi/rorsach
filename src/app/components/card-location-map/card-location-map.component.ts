import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { forkJoin } from 'rxjs';

import {
  CardLocationCatalog,
  CardLocationMap,
  CardLocationRegion,
  LocationRegionType
} from '../../models/rorschach.models';

type CardLocationMapCollection = Record<string, CardLocationMap>;

interface PaletteGroup {
  title: string;
  type: LocationRegionType;
  regions: CardLocationRegion[];
}

@Component({
  selector: 'app-card-location-map',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './card-location-map.component.html',
  styleUrl: './card-location-map.component.scss'
})
export class CardLocationMapComponent implements OnInit, OnChanges {
  private readonly http = inject(HttpClient);

  @Input() cardNumber = '';
  @Input() selectedLocationCodes: string[] = [];

  @Output() locationSelectionChange = new EventEmitter<string[]>();
  @Output() regionClicked = new EventEmitter<CardLocationRegion>();
  @Output() selectedRegionsChange = new EventEmitter<CardLocationRegion[]>();

  maps: CardLocationMapCollection = {};
  catalog: CardLocationCatalog = {};
  cardMap: CardLocationMap | null = null;
  selectedCodes = new Set<string>();
  hoveredCode: string | null = null;
  showLabels = false;
  imageMissing = false;
  loadFailed = false;

  get selectedCodeList(): string[] {
    return [...this.selectedCodes];
  }

  get spatialRegions(): CardLocationRegion[] {
    return (this.cardMap?.regions ?? []).filter((region) => !!region.points?.trim());
  }

  get hasSpatialMap(): boolean {
    return this.spatialRegions.length > 0;
  }

  get paletteRegions(): CardLocationRegion[] {
    const byCode = new Map<string, CardLocationRegion>();

    for (const region of this.catalog[this.cardNumber]?.regions ?? []) {
      byCode.set(region.code, {
        ...region,
        shape: 'polygon',
        points: ''
      });
    }

    for (const region of this.cardMap?.regions ?? []) {
      byCode.set(region.code, region);
    }

    return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
  }

  get paletteGroups(): PaletteGroup[] {
    const order: LocationRegionType[] = ['W', 'D', 'S', 'Dd', 'DdS'];
    const titles: Record<LocationRegionType, string> = {
      W: 'Whole',
      D: 'Common D',
      S: 'White space',
      Dd: 'Unusual Dd',
      DdS: 'Unusual space'
    };

    return order
      .map((type) => ({
        title: titles[type],
        type,
        regions: this.paletteRegions.filter((region) => region.type === type)
      }))
      .filter((group) => group.regions.length);
  }

  get statusNote(): string {
    if (this.catalog[this.cardNumber]?.note) {
      return this.catalog[this.cardNumber].note ?? '';
    }
    return this.cardMap?.source ?? '';
  }

  ngOnInit(): void {
    forkJoin({
      maps: this.http.get<CardLocationMapCollection>('assets/data/card-location-maps.json'),
      catalog: this.http.get<CardLocationCatalog>('assets/data/card-location-catalog.json')
    }).subscribe({
      next: ({ maps, catalog }) => {
        this.maps = maps;
        this.catalog = catalog;
        this.setActiveMap();
      },
      error: () => {
        this.loadFailed = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedLocationCodes']) {
      this.selectedCodes = new Set(this.selectedLocationCodes ?? []);
    }

    if (changes['cardNumber']) {
      this.imageMissing = false;
      this.setActiveMap();
    }
  }

  isSelected(code: string): boolean {
    return this.selectedCodes.has(code);
  }

  selectWholeBlot(): void {
    const wholeRegion = this.paletteRegions.find((region) => region.code === 'W');
    this.selectedCodes = new Set(['W']);
    this.emitSelection();
    if (wholeRegion) {
      this.regionClicked.emit(wholeRegion);
    }
  }

  clearSelection(): void {
    this.selectedCodes = new Set<string>();
    this.emitSelection();
  }

  toggleRegion(region: CardLocationRegion): void {
    if (this.selectedCodes.has(region.code)) {
      this.selectedCodes.delete(region.code);
    } else {
      if (region.type === 'W') {
        this.selectedCodes = new Set(['W']);
      } else {
        this.selectedCodes.delete('W');
        this.selectedCodes.add(region.code);
      }
    }

    this.regionClicked.emit(region);
    this.emitSelection();
  }

  labelPosition(region: CardLocationRegion): { x: number; y: number } {
    const points = (region.points ?? '')
      .trim()
      .split(/\s+/)
      .map((pair) => pair.split(',').map(Number))
      .filter((pair) => pair.length === 2 && pair.every((value) => Number.isFinite(value)));

    if (!points.length) {
      return { x: 0, y: 0 };
    }

    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    return {
      x: (Math.min(...xs) + Math.max(...xs)) / 2,
      y: (Math.min(...ys) + Math.max(...ys)) / 2
    };
  }

  private setActiveMap(): void {
    this.cardMap = this.cardNumber ? this.maps[this.cardNumber] ?? null : null;
    this.imageMissing = false;
  }

  private emitSelection(): void {
    const codes = this.selectedCodeList;
    this.locationSelectionChange.emit(codes);
    this.selectedRegionsChange.emit(this.selectedRegions());
  }

  private selectedRegions(): CardLocationRegion[] {
    return this.paletteRegions.filter((region) => this.selectedCodes.has(region.code));
  }
}
