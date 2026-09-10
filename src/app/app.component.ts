import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
  CardLocationRegion,
  CardOption,
  CodingOptions,
  LocationMark,
  ProtocolMetadata,
  ReferenceStatus,
  RorschachResponse,
  SavedProtocol,
  StructuralSummaryPreview
} from './models/rorschach.models';
import { CardLocationMapComponent } from './components/card-location-map/card-location-map.component';
import { ExportService } from './services/export.service';
import { LocalStorageService } from './services/local-storage.service';

const DEFAULT_OPTIONS: CodingOptions = {
  cards: [],
  locations: [],
  developmentalQualities: [],
  determinants: [],
  formQualities: [],
  contentCodes: [],
  specialScores: [],
  confidenceLevels: []
};

const DEFAULT_REFERENCE_STATUS: ReferenceStatus = {
  locations: 'manual-required',
  formQuality: 'manual-required',
  populars: 'manual-required',
  specialScores: 'manual-required',
  structuralSummary: 'partial'
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatToolbarModule,
    CardLocationMapComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly storage = inject(LocalStorageService);
  private readonly exports = inject(ExportService);
  private readonly snackBar = inject(MatSnackBar);

  options: CodingOptions = DEFAULT_OPTIONS;
  referenceStatus: ReferenceStatus = DEFAULT_REFERENCE_STATUS;
  responses: RorschachResponse[] = [];
  editingId: string | null = null;
  imageMissing = false;
  locationTypeWarning = '';
  private patchingResponse = false;

  readonly displayedColumns = [
    'cardNumber',
    'responseNumber',
    'verbatimResponse',
    'inquiry',
    'location',
    'locationNumber',
    'developmentalQuality',
    'determinants',
    'formQuality',
    'contentCodes',
    'popular',
    'specialScores',
    'confidence',
    'actions'
  ];

  readonly metadataForm = this.fb.group({
    examineeCode: [''],
    age: [null],
    gender: [''],
    date: [''],
    examiner: [''],
    notes: ['']
  });

  readonly responseForm = this.fb.group({
    cardNumber: ['', Validators.required],
    responseNumber: [null, Validators.required],
    verbatimResponse: ['', Validators.required],
    inquiry: [''],
    locationPointed: [''],
    madeItLookLike: [''],
    examinerNotes: [''],
    imageLocations: [[]],
    location: ['', Validators.required],
    locationNumber: [''],
    developmentalQuality: [''],
    determinants: [[]],
    formQuality: [''],
    formQualityExplanation: [''],
    contentCodes: [[]],
    popular: [false],
    specialScores: [[]],
    codingExplanation: [''],
    confidence: ['Medium'],
    missingInformation: [''],
    selectedLocationCodes: [[]],
    selectedLocationRegions: [[]]
  });

  ngOnInit(): void {
    this.loadConfig();
    this.restoreDraftSilently();
    this.responseForm.get('cardNumber')?.valueChanges.subscribe(() => {
      this.imageMissing = false;
      if (!this.patchingResponse) {
        this.clearMapSelectionFields();
      }
    });
    this.responseForm.get('formQuality')?.valueChanges.subscribe(() => {
      this.syncConditionalValidators();
    });
    this.responseForm.get('confidence')?.valueChanges.subscribe(() => {
      this.syncConditionalValidators();
    });
    this.syncConditionalValidators();
  }

  get selectedCard(): CardOption | undefined {
    return this.options.cards.find((card) => card.value === this.responseForm.get('cardNumber')?.value);
  }

  get locationMarks(): LocationMark[] {
    return this.responseForm.get('imageLocations')?.value ?? [];
  }

  get selectedLocationCodes(): string[] {
    return this.responseForm.get('selectedLocationCodes')?.value ?? [];
  }

  get summary(): StructuralSummaryPreview {
    return {
      totalResponses: this.responses.length,
      byCard: this.countByValue(this.responses.map((response) => response.cardNumber)),
      byLocation: this.countByValue(this.responses.map((response) => response.location)),
      byDevelopmentalQuality: this.countByValue(this.responses.map((response) => response.developmentalQuality)),
      byDeterminants: this.countByArray(this.responses.map((response) => response.determinants)),
      byContent: this.countByArray(this.responses.map((response) => response.contentCodes)),
      bySpecialScores: this.countByArray(this.responses.map((response) => response.specialScores)),
      popularCount: this.responses.filter((response) => response.popular).length,
      byFormQuality: this.countByValue(this.responses.map((response) => response.formQuality))
    };
  }

  get needsReferenceLookup(): boolean {
    return !this.responseForm.get('locationNumber')?.value
      || !this.responseForm.get('formQuality')?.value
      || !(this.responseForm.get('specialScores')?.value as string[]).length;
  }

  addOrUpdateResponse(): void {
    if (this.responseForm.invalid) {
      this.responseForm.markAllAsTouched();
      this.snackBar.open('Required response fields need attention.', 'Dismiss', { duration: 3000 });
      return;
    }

    const response = this.buildResponseFromForm();
    if (this.editingId) {
      this.responses = this.responses.map((item) => item.id === this.editingId ? response : item);
      this.snackBar.open('Response updated.', 'Dismiss', { duration: 2500 });
    } else {
      this.responses = [...this.responses, response];
      this.snackBar.open('Response added.', 'Dismiss', { duration: 2500 });
    }

    this.saveToLocalStorage(false);
    this.clearResponseForm();
  }

  editResponse(response: RorschachResponse): void {
    this.editingId = response.id;
    this.patchingResponse = true;
    this.responseForm.patchValue({
      ...response,
      selectedLocationCodes: response.selectedLocationCodes ?? [],
      selectedLocationRegions: response.selectedLocationRegions ?? []
    });
    this.patchingResponse = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteResponse(id: string): void {
    this.responses = this.responses.filter((response) => response.id !== id);
    if (this.editingId === id) {
      this.clearResponseForm();
    }
    this.saveToLocalStorage(false);
    this.snackBar.open('Response deleted.', 'Dismiss', { duration: 2500 });
  }

  clearResponseForm(): void {
    this.editingId = null;
    this.imageMissing = false;
    this.responseForm.reset({
      cardNumber: '',
      responseNumber: null,
      verbatimResponse: '',
      inquiry: '',
      locationPointed: '',
      madeItLookLike: '',
      examinerNotes: '',
      imageLocations: [],
      location: '',
      locationNumber: '',
      developmentalQuality: '',
      determinants: [],
      formQuality: '',
      formQualityExplanation: '',
      contentCodes: [],
      popular: false,
      specialScores: [],
      codingExplanation: '',
      confidence: 'Medium',
      missingInformation: '',
      selectedLocationCodes: [],
      selectedLocationRegions: []
    });
    this.locationTypeWarning = '';
  }

  onLocationSelectionChange(codes: string[]): void {
    this.responseForm.patchValue({
      selectedLocationCodes: codes,
      locationNumber: codes.includes('W') ? 'W' : codes.join(',')
    });

    if (!codes.length) {
      this.responseForm.patchValue({ locationNumber: '' });
      this.locationTypeWarning = '';
      return;
    }
  }

  onSelectedRegionsChange(regions: CardLocationRegion[]): void {
    this.responseForm.patchValue({
      selectedLocationRegions: regions
    });
    this.applyLocationAutoFill(regions);
  }

  onRegionClicked(region: CardLocationRegion): void {
    if (region.type !== 'W') {
      this.snackBar.open(`${region.code}: ${region.description ?? region.label}`, 'Dismiss', { duration: 2500 });
    }
  }

  saveToLocalStorage(showMessage = true): void {
    this.storage.save(this.currentProtocol());
    if (showMessage) {
      this.snackBar.open('Draft saved to localStorage.', 'Dismiss', { duration: 2500 });
    }
  }

  loadFromLocalStorage(): void {
    const saved = this.storage.load();
    if (!saved) {
      this.snackBar.open('No saved protocol draft found.', 'Dismiss', { duration: 3000 });
      return;
    }
    this.applyProtocol(saved);
    this.snackBar.open('Draft loaded from localStorage.', 'Dismiss', { duration: 2500 });
  }

  exportJson(): void {
    this.exports.exportJson(this.currentProtocol());
  }

  exportCsv(): void {
    this.exports.exportCsv(this.responses);
  }

  importJson(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        this.applyProtocol(this.exports.parseJson(String(reader.result)));
        this.saveToLocalStorage(false);
        this.snackBar.open('Protocol JSON imported.', 'Dismiss', { duration: 2500 });
      } catch (error) {
        this.snackBar.open(error instanceof Error ? error.message : 'Import failed.', 'Dismiss', { duration: 4000 });
      } finally {
        input.value = '';
      }
    };
    reader.readAsText(file);
  }

  addImageLocation(event: MouseEvent): void {
    if (!this.selectedCard) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const mark: LocationMark = {
      x: this.clamp(((event.clientX - rect.left) / rect.width) * 100),
      y: this.clamp(((event.clientY - rect.top) / rect.height) * 100)
    };

    this.responseForm.patchValue({
      imageLocations: [...this.locationMarks, mark]
    });
  }

  removeImageLocation(index: number): void {
    this.responseForm.patchValue({
      imageLocations: this.locationMarks.filter((_, itemIndex) => itemIndex !== index)
    });
  }

  clearImageLocations(): void {
    this.responseForm.patchValue({ imageLocations: [] });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.responseForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }

  objectEntries(record: Record<string, number>): Array<{ key: string; value: number }> {
    return Object.entries(record)
      .filter(([key]) => !!key)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  private loadConfig(): void {
    this.http.get<CodingOptions>('assets/data/coding-options.json').subscribe({
      next: (options) => {
        this.options = options;
      },
      error: () => {
        this.snackBar.open('Coding options could not be loaded.', 'Dismiss', { duration: 4000 });
      }
    });

    this.http.get<ReferenceStatus>('assets/data/reference-status.json').subscribe({
      next: (status) => {
        this.referenceStatus = status;
      }
    });
  }

  private restoreDraftSilently(): void {
    const saved = this.storage.load();
    if (saved) {
      this.applyProtocol(saved);
    }
  }

  private syncConditionalValidators(): void {
    this.setRequiredWhen(this.responseForm.get('formQualityExplanation'), this.responseForm.get('formQuality')?.value === 'FQ-');
    this.setRequiredWhen(this.responseForm.get('missingInformation'), this.responseForm.get('confidence')?.value === 'Low');
  }

  private setRequiredWhen(control: AbstractControl | null, required: boolean): void {
    if (!control) {
      return;
    }

    control.setValidators(required ? [Validators.required] : []);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private buildResponseFromForm(): RorschachResponse {
    const raw = this.responseForm.getRawValue();
    return {
      ...raw,
      id: this.editingId ?? crypto.randomUUID(),
      imageLocations: raw.imageLocations ?? [],
      determinants: raw.determinants ?? [],
      contentCodes: raw.contentCodes ?? [],
      specialScores: raw.specialScores ?? [],
      selectedLocationCodes: raw.selectedLocationCodes ?? [],
      selectedLocationRegions: raw.selectedLocationRegions ?? []
    } as RorschachResponse;
  }

  private clearMapSelectionFields(): void {
    this.responseForm.patchValue({
      selectedLocationCodes: [],
      selectedLocationRegions: [],
      locationNumber: ''
    });
    this.locationTypeWarning = '';
  }

  private applyLocationAutoFill(regions: CardLocationRegion[]): void {
    const types = [...new Set(regions.map((region) => region.type))];

    if (!regions.length) {
      this.locationTypeWarning = '';
      return;
    }

    if (types.includes('W')) {
      this.responseForm.patchValue({ location: 'W', locationNumber: 'W' });
      this.locationTypeWarning = '';
      return;
    }

    if (types.length === 1 && types[0] === 'D') {
      this.responseForm.patchValue({ location: 'D' });
      this.locationTypeWarning = '';
      return;
    }

    if (types.every((type) => type === 'Dd' || type === 'DdS')) {
      this.responseForm.patchValue({ location: 'Dd' });
      this.locationTypeWarning = '';
      return;
    }

    if (types.length === 1 && types[0] === 'S') {
      this.responseForm.patchValue({ location: 'S' });
      this.locationTypeWarning = '';
      return;
    }

    if (types.some((type) => type === 'D') && types.some((type) => type === 'Dd' || type === 'DdS')) {
      this.responseForm.patchValue({ location: '' });
      this.locationTypeWarning = 'Mixed location types selected. Confirm Location manually.';
      this.snackBar.open(this.locationTypeWarning, 'Dismiss', { duration: 3500 });
      return;
    }

    this.responseForm.patchValue({ location: '' });
    this.locationTypeWarning = 'Mixed location types selected. Confirm Location manually.';
  }

  private currentProtocol(): SavedProtocol {
    return {
      metadata: this.metadataForm.getRawValue() as ProtocolMetadata,
      responses: this.responses
    };
  }

  private applyProtocol(protocol: SavedProtocol): void {
    this.metadataForm.patchValue(protocol.metadata);
    this.responses = protocol.responses ?? [];
  }

  private countByValue(values: string[]): Record<string, number> {
    return values.reduce<Record<string, number>>((counts, value) => {
      if (value) {
        counts[value] = (counts[value] ?? 0) + 1;
      }
      return counts;
    }, {});
  }

  private countByArray(values: string[][]): Record<string, number> {
    return values.flat().reduce<Record<string, number>>((counts, value) => {
      if (value) {
        counts[value] = (counts[value] ?? 0) + 1;
      }
      return counts;
    }, {});
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
  }
}
