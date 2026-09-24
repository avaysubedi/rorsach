export interface SelectOption {
  value: string;
  label: string;
}

export interface CardOption extends SelectOption {
  image: string;
}

export interface CodingOptions {
  cards: CardOption[];
  locations: SelectOption[];
  developmentalQualities: SelectOption[];
  determinants: SelectOption[];
  formQualities: SelectOption[];
  contentCodes: SelectOption[];
  specialScores: SelectOption[];
  confidenceLevels: SelectOption[];
}

export interface ReferenceStatus {
  locations: string;
  formQuality: string;
  populars: string;
  specialScores: string;
  structuralSummary: string;
}

export type LocationRegionType = 'W' | 'D' | 'Dd' | 'DdS' | 'S';
export type LocationMapSpatialStatus = 'starter' | 'catalog-only';

export interface CardLocationMap {
  image: string;
  viewBox: string;
  source?: string;
  spatialStatus?: LocationMapSpatialStatus;
  regions: CardLocationRegion[];
}

export interface CardLocationRegion {
  code: string;
  type: LocationRegionType;
  label: string;
  shape: 'polygon';
  points?: string;
  description?: string;
}

export interface CardLocationCatalogEntry {
  note?: string;
  regions: Array<Omit<CardLocationRegion, 'shape' | 'points'>>;
}

export type CardLocationCatalog = Record<string, CardLocationCatalogEntry>;

export interface LocationMark {
  x: number;
  y: number;
}

export interface ProtocolMetadata {
  examineeCode: string;
  age: number | null;
  gender: string;
  date: string;
  examiner: string;
  notes: string;
}

export interface RorschachResponse {
  id: string;
  cardNumber: string;
  responseNumber: number | null;
  verbatimResponse: string;
  inquiry: string;
  locationPointed: string;
  madeItLookLike: string;
  examinerNotes: string;
  imageLocations: LocationMark[];
  location: string;
  locationNumber: string;
  developmentalQuality: string;
  determinants: string[];
  formQuality: string;
  formQualityExplanation: string;
  contentCodes: string[];
  popular: boolean;
  specialScores: string[];
  codingExplanation: string;
  confidence: string;
  missingInformation: string;
  selectedLocationCodes?: string[];
  selectedLocationRegions?: CardLocationRegion[];
  assistance?: AssistanceDecision[];
}

export interface SavedProtocol {
  metadata: ProtocolMetadata;
  responses: RorschachResponse[];
}

export type FqSymbol = '+' | 'o' | 'u' | '-';

export interface ReferenceCitation {
  tableId: string;
  card: string;
  page?: string;
}

export interface FqEntry {
  id: string;
  card: string;
  locationCode: string;
  locationType: LocationRegionType;
  label: string;
  qualifier?: string;
  symbol: FqSymbol;
  aliases?: string[];
  citation: ReferenceCitation;
}

export interface PopularEntry {
  id: string;
  card: string;
  locationCode?: string;
  statement: string;
  matchLabels: string[];
  citation: ReferenceCitation;
}

export interface ZEntry {
  id: string;
  card: string;
  w: number;
  adjacent: number;
  distant: number;
  space: number;
  citation: ReferenceCitation;
}

export interface RuleEntry {
  id: string;
  card?: string;
  locationCode?: string;
  label: string;
  suggestedCode: string;
  rationale: string;
  citation: ReferenceCitation;
}

export interface ReferencePack {
  schemaVersion: 1;
  id: string;
  edition: string;
  citation: string;
  datasets: {
    formQuality?: FqEntry[];
    populars?: PopularEntry[];
    zValues?: ZEntry[];
    specialScores?: RuleEntry[];
    content?: RuleEntry[];
    humanMovement?: RuleEntry[];
    animalMovement?: RuleEntry[];
  };
}

export interface AssistanceDecision {
  dataset: 'formQuality' | 'popular' | 'locationHint';
  entryId: string;
  suggestedValue: string;
  confidence: number;
  source: ReferenceCitation;
  status: 'suggested' | 'accepted' | 'dismissed' | 'overridden';
  examinerValue: string;
}

export interface StructuralSummaryPreview {
  totalResponses: number;
  byCard: Record<string, number>;
  byLocation: Record<string, number>;
  byDevelopmentalQuality: Record<string, number>;
  byDeterminants: Record<string, number>;
  byContent: Record<string, number>;
  bySpecialScores: Record<string, number>;
  popularCount: number;
  byFormQuality: Record<string, number>;
}
