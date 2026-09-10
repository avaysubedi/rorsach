import { Injectable } from '@angular/core';

import { RorschachResponse, SavedProtocol } from '../models/rorschach.models';

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportJson(protocol: SavedProtocol): void {
    this.download('rorschach-protocol.json', JSON.stringify(protocol, null, 2), 'application/json');
  }

  parseJson(text: string): SavedProtocol {
    const parsed = JSON.parse(text) as SavedProtocol;
    if (!parsed.metadata || !Array.isArray(parsed.responses)) {
      throw new Error('Imported JSON must contain metadata and responses.');
    }
    return parsed;
  }

  exportCsv(responses: RorschachResponse[]): void {
    const headers = [
      'Card',
      'R#',
      'Verbatim Response',
      'Inquiry',
      'Location',
      'Loc No',
      'DQ',
      'Determinants',
      'FQ',
      'Content',
      'P',
      'Special Scores',
      'Confidence'
    ];

    const rows = responses.map((response) => [
      response.cardNumber,
      response.responseNumber ?? '',
      response.verbatimResponse,
      response.inquiry,
      response.location,
      response.locationNumber,
      response.developmentalQuality,
      response.determinants.join('; '),
      response.formQuality,
      response.contentCodes.join('; '),
      response.popular ? 'Yes' : 'No',
      response.specialScores.join('; '),
      response.confidence
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => this.csvCell(String(cell))).join(','))
      .join('\n');

    this.download('rorschach-responses.csv', csv, 'text/csv');
  }

  private csvCell(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
  }

  private download(filename: string, content: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
