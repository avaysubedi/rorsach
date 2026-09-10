/**
 * Starter location maps for Cards II, III, V–X.
 * Photos are 723x1024 shown with object-fit:contain in a 1000x1000 square.
 * Image-fraction (fx, fy) → viewBox: x = 147 + fx*706, y = fy*1000
 */
const OX = 147;
const SW = 706;

function pt(fx, fy) {
  return `${Math.round(OX + fx * SW)},${Math.round(fy * 1000)}`;
}

function poly(pairs) {
  return pairs.map(([x, y]) => pt(x, y)).join(' ');
}

function region(code, type, description, pairs, label = code) {
  return {
    code,
    type,
    label,
    shape: 'polygon',
    points: poly(pairs),
    description
  };
}

function card(key, source, regions) {
  return {
    image: `assets/cards/card-${key.toLowerCase()}.png`,
    viewBox: '0 0 1000 1000',
    spatialStatus: 'starter',
    source,
    regions
  };
}

const II = card('II', 'Starter map from Figure A.2 + Card II photo; verify before clinical use.', [
  region('W', 'W', 'Whole blot', [
    [0.18, 0.40], [0.22, 0.36], [0.36, 0.24], [0.42, 0.26], [0.47, 0.36],
    [0.53, 0.36], [0.58, 0.26], [0.64, 0.24], [0.78, 0.36], [0.83, 0.45],
    [0.80, 0.54], [0.62, 0.56], [0.58, 0.62], [0.50, 0.61], [0.42, 0.62],
    [0.38, 0.56], [0.20, 0.54]
  ], 'Whole blot'),
  region('D1', 'D', 'Upper right red common detail', [
    [0.55, 0.25], [0.64, 0.23], [0.66, 0.30], [0.63, 0.37], [0.56, 0.38], [0.54, 0.31]
  ]),
  region('D2', 'D', 'Upper left red common detail', [
    [0.36, 0.23], [0.45, 0.25], [0.46, 0.31], [0.44, 0.38], [0.37, 0.37], [0.34, 0.30]
  ]),
  region('D3', 'D', 'Lower central red common detail', [
    [0.42, 0.50], [0.50, 0.50], [0.58, 0.50], [0.58, 0.62], [0.50, 0.60], [0.42, 0.62]
  ]),
  region('D4', 'D', 'Right black common detail', [
    [0.54, 0.36], [0.78, 0.36], [0.83, 0.45], [0.78, 0.55], [0.56, 0.52], [0.53, 0.42]
  ]),
  region('D6', 'D', 'Both upper red details combined', [
    [0.34, 0.23], [0.66, 0.23], [0.66, 0.38], [0.34, 0.38]
  ]),
  region('DS5', 'S', 'Central white space', [
    [0.43, 0.38], [0.57, 0.38], [0.57, 0.52], [0.43, 0.52]
  ]),
  region('Dd21', 'Dd', 'Small upper-right unusual detail', [
    [0.60, 0.33], [0.66, 0.33], [0.66, 0.39], [0.60, 0.39]
  ]),
  region('Dd22', 'Dd', 'Small lower-left outer unusual detail', [
    [0.18, 0.50], [0.24, 0.50], [0.24, 0.56], [0.18, 0.56]
  ]),
  region('Dd23', 'Dd', 'Lower-right inner unusual detail', [
    [0.52, 0.52], [0.58, 0.52], [0.58, 0.58], [0.52, 0.58]
  ]),
  region('Dd24', 'Dd', 'Lower-left inner unusual detail', [
    [0.42, 0.52], [0.48, 0.52], [0.48, 0.58], [0.42, 0.58]
  ]),
  region('Dd25', 'Dd', 'Lower-left inner space/edge detail', [
    [0.44, 0.54], [0.49, 0.54], [0.49, 0.60], [0.44, 0.60]
  ]),
  region('Dd26', 'Dd', 'Upper-right small unusual detail', [
    [0.58, 0.35], [0.64, 0.35], [0.64, 0.40], [0.58, 0.40]
  ]),
  region('Dd27', 'Dd', 'Upper inner white-space edge', [
    [0.47, 0.36], [0.53, 0.36], [0.53, 0.42], [0.47, 0.42]
  ]),
  region('Dd28', 'Dd', 'Lower-right inner space/edge detail', [
    [0.51, 0.54], [0.56, 0.54], [0.56, 0.60], [0.51, 0.60]
  ]),
  region('Dd31', 'Dd', 'Right outer small unusual detail', [
    [0.78, 0.40], [0.84, 0.40], [0.84, 0.47], [0.78, 0.47]
  ]),
  region('DdS29', 'DdS', 'Upper-right inner space detail', [
    [0.52, 0.40], [0.58, 0.40], [0.58, 0.46], [0.52, 0.46]
  ]),
  region('DdS30', 'DdS', 'Upper-left inner space detail', [
    [0.42, 0.40], [0.48, 0.40], [0.48, 0.46], [0.42, 0.46]
  ])
]);

const III = card('III', 'Starter map from Figure A.3 + Card III photo; verify before clinical use.', [
  region('W', 'W', 'Whole blot', [
    [0.22, 0.32], [0.28, 0.28], [0.38, 0.34], [0.46, 0.40], [0.54, 0.40],
    [0.62, 0.34], [0.72, 0.28], [0.78, 0.32], [0.80, 0.42], [0.74, 0.52],
    [0.62, 0.58], [0.50, 0.60], [0.38, 0.58], [0.26, 0.52], [0.20, 0.42]
  ], 'Whole blot'),
  region('D1', 'D', 'Human figure (right side as labeled)', [
    [0.54, 0.34], [0.66, 0.30], [0.74, 0.38], [0.70, 0.54], [0.58, 0.56], [0.54, 0.46]
  ]),
  region('D2', 'D', 'Left outer red common detail', [
    [0.20, 0.30], [0.28, 0.28], [0.30, 0.38], [0.24, 0.42], [0.18, 0.38]
  ]),
  region('D3', 'D', 'Center red bow / butterfly', [
    [0.44, 0.40], [0.56, 0.40], [0.56, 0.48], [0.44, 0.48]
  ]),
  region('D5', 'D', 'Right lower-leg common detail', [
    [0.64, 0.50], [0.74, 0.50], [0.76, 0.58], [0.64, 0.58]
  ]),
  region('D7', 'D', 'Lower central common detail', [
    [0.42, 0.50], [0.58, 0.50], [0.58, 0.60], [0.42, 0.60]
  ]),
  region('D8', 'D', 'Lower-center inner common detail', [
    [0.45, 0.52], [0.55, 0.52], [0.55, 0.58], [0.45, 0.58]
  ]),
  region('D9', 'D', 'Head / upper human-figure detail', [
    [0.32, 0.30], [0.42, 0.30], [0.42, 0.40], [0.32, 0.40]
  ]),
  region('Dd21', 'Dd', 'Right mid unusual detail', [
    [0.62, 0.42], [0.70, 0.42], [0.70, 0.48], [0.62, 0.48]
  ]),
  region('Dd22', 'Dd', 'Left inner mid unusual detail', [
    [0.34, 0.42], [0.42, 0.42], [0.42, 0.48], [0.34, 0.48]
  ]),
  region('Dd25', 'Dd', 'Upper-right small unusual detail', [
    [0.60, 0.28], [0.68, 0.28], [0.68, 0.34], [0.60, 0.34]
  ]),
  region('Dd26', 'Dd', 'Lower-right unusual detail', [
    [0.58, 0.52], [0.66, 0.52], [0.66, 0.58], [0.58, 0.58]
  ]),
  region('Dd27', 'Dd', 'Upper inner unusual detail', [
    [0.46, 0.34], [0.54, 0.34], [0.54, 0.40], [0.46, 0.40]
  ]),
  region('Dd28', 'Dd', 'Center inner unusual detail', [
    [0.46, 0.42], [0.54, 0.42], [0.54, 0.48], [0.46, 0.48]
  ]),
  region('Dd29', 'Dd', 'Upper-center small unusual detail', [
    [0.47, 0.36], [0.53, 0.36], [0.53, 0.42], [0.47, 0.42]
  ]),
  region('Dd30', 'Dd', 'Right inner mid unusual detail', [
    [0.56, 0.42], [0.64, 0.42], [0.64, 0.48], [0.56, 0.48]
  ]),
  region('Dd31', 'Dd', 'Lower inner unusual detail', [
    [0.48, 0.50], [0.56, 0.50], [0.56, 0.56], [0.48, 0.56]
  ]),
  region('Dd32', 'Dd', 'Right outer red unusual detail', [
    [0.72, 0.30], [0.80, 0.28], [0.82, 0.38], [0.74, 0.40]
  ]),
  region('Dd33', 'Dd', 'Lower-right inner unusual detail', [
    [0.56, 0.54], [0.64, 0.54], [0.64, 0.60], [0.56, 0.60]
  ]),
  region('Dd34', 'Dd', 'Left outer red splash', [
    [0.18, 0.28], [0.26, 0.28], [0.26, 0.36], [0.18, 0.36]
  ]),
  region('Dd35', 'Dd', 'Upper-left small unusual detail', [
    [0.32, 0.28], [0.40, 0.28], [0.40, 0.34], [0.32, 0.34]
  ]),
  region('DdS23', 'DdS', 'Lower-right white-space detail', [
    [0.58, 0.48], [0.70, 0.48], [0.70, 0.56], [0.58, 0.56]
  ]),
  region('DdS24', 'DdS', 'Large central white space', [
    [0.36, 0.36], [0.64, 0.36], [0.64, 0.52], [0.36, 0.52]
  ])
]);

const V = card('V', 'Starter map from Figure A.5 + Card V photo; verify before clinical use.', [
  region('W', 'W', 'Whole blot', [
    [0.10, 0.50], [0.22, 0.42], [0.40, 0.40], [0.47, 0.34], [0.50, 0.32],
    [0.53, 0.34], [0.60, 0.40], [0.78, 0.42], [0.90, 0.50], [0.82, 0.56],
    [0.58, 0.58], [0.52, 0.64], [0.48, 0.64], [0.42, 0.58], [0.18, 0.56]
  ], 'Whole blot'),
  region('D1', 'D', 'Right wing-tip common detail', [
    [0.78, 0.44], [0.92, 0.48], [0.90, 0.56], [0.76, 0.54]
  ]),
  region('D4', 'D', 'Left wing common detail', [
    [0.08, 0.44], [0.40, 0.40], [0.42, 0.56], [0.12, 0.56]
  ]),
  region('D6', 'D', 'Upper projections / “ears”', [
    [0.44, 0.32], [0.56, 0.32], [0.56, 0.42], [0.44, 0.42]
  ]),
  region('D7', 'D', 'Central vertical body', [
    [0.47, 0.40], [0.53, 0.40], [0.53, 0.62], [0.47, 0.62]
  ]),
  region('D9', 'D', 'Lower central legs', [
    [0.46, 0.54], [0.54, 0.54], [0.54, 0.64], [0.46, 0.64]
  ]),
  region('D10', 'D', 'Far right wing-tip common detail', [
    [0.82, 0.46], [0.94, 0.50], [0.90, 0.56], [0.80, 0.54]
  ]),
  region('Dd22', 'Dd', 'Left mid-wing unusual detail', [
    [0.18, 0.46], [0.28, 0.46], [0.28, 0.54], [0.18, 0.54]
  ]),
  region('Dd23', 'Dd', 'Right lower-wing unusual detail', [
    [0.62, 0.50], [0.78, 0.50], [0.78, 0.58], [0.62, 0.58]
  ]),
  region('Dd24', 'Dd', 'Upper-center small unusual detail', [
    [0.48, 0.38], [0.54, 0.38], [0.54, 0.44], [0.48, 0.44]
  ]),
  region('Dd25', 'Dd', 'Lower-left inner unusual detail', [
    [0.40, 0.50], [0.46, 0.50], [0.46, 0.56], [0.40, 0.56]
  ]),
  region('Dd26', 'Dd', 'Right mid-wing unusual detail', [
    [0.72, 0.46], [0.82, 0.46], [0.82, 0.54], [0.72, 0.54]
  ]),
  region('Dd30', 'Dd', 'Upper-center between projections', [
    [0.47, 0.34], [0.53, 0.34], [0.53, 0.40], [0.47, 0.40]
  ]),
  region('Dd31', 'Dd', 'Top-center small unusual detail', [
    [0.48, 0.31], [0.52, 0.31], [0.52, 0.36], [0.48, 0.36]
  ]),
  region('Dd32', 'Dd', 'Lower-center inner unusual detail', [
    [0.48, 0.46], [0.52, 0.46], [0.52, 0.54], [0.48, 0.54]
  ]),
  region('Dd33', 'Dd', 'Upper-right inner unusual detail', [
    [0.54, 0.36], [0.62, 0.36], [0.62, 0.42], [0.54, 0.42]
  ]),
  region('Dd34', 'Dd', 'Upper-left inner unusual detail', [
    [0.38, 0.36], [0.46, 0.36], [0.46, 0.42], [0.38, 0.42]
  ]),
  region('Dd35', 'Dd', 'Left upper-wing unusual detail', [
    [0.22, 0.40], [0.34, 0.40], [0.34, 0.48], [0.22, 0.48]
  ]),
  region('DdS27', 'DdS', 'Lower-center white/edge space', [
    [0.47, 0.56], [0.53, 0.56], [0.53, 0.64], [0.47, 0.64]
  ]),
  region('DdS28', 'DdS', 'Upper inner white space', [
    [0.46, 0.36], [0.54, 0.36], [0.54, 0.46], [0.46, 0.46]
  ]),
  region('DdS29', 'DdS', 'Left outer white-edge detail', [
    [0.08, 0.50], [0.16, 0.50], [0.16, 0.56], [0.08, 0.56]
  ])
]);

const VI = card('VI', 'Starter map from Figure A.6 + Card VI photo; verify before clinical use.', [
  region('W', 'W', 'Whole blot', [
    [0.28, 0.28], [0.42, 0.22], [0.50, 0.18], [0.58, 0.22], [0.72, 0.28],
    [0.78, 0.42], [0.76, 0.58], [0.62, 0.66], [0.50, 0.68], [0.38, 0.66],
    [0.24, 0.58], [0.22, 0.42]
  ], 'Whole blot'),
  region('D1', 'D', 'Large lower body (may include dashed area)', [
    [0.24, 0.40], [0.76, 0.40], [0.76, 0.66], [0.24, 0.66]
  ]),
  region('D2', 'D', 'Upper whisker / side-top common detail', [
    [0.32, 0.24], [0.68, 0.24], [0.68, 0.36], [0.32, 0.36]
  ]),
  region('D3', 'D', 'Top-most projection', [
    [0.44, 0.16], [0.56, 0.16], [0.56, 0.28], [0.44, 0.28]
  ]),
  region('D4', 'D', 'Right half of blot', [
    [0.50, 0.28], [0.76, 0.30], [0.78, 0.58], [0.50, 0.64]
  ]),
  region('D5', 'D', 'Central vertical column', [
    [0.47, 0.28], [0.53, 0.28], [0.53, 0.66], [0.47, 0.66]
  ]),
  region('D6', 'D', 'Upper-center stem', [
    [0.46, 0.18], [0.54, 0.18], [0.54, 0.36], [0.46, 0.36]
  ]),
  region('D8', 'D', 'Upper body below top projection', [
    [0.40, 0.26], [0.60, 0.26], [0.60, 0.40], [0.40, 0.40]
  ]),
  region('D12', 'D', 'Right inner column / body', [
    [0.50, 0.32], [0.62, 0.32], [0.62, 0.62], [0.50, 0.62]
  ]),
  region('Dd21', 'Dd', 'Lower-left small unusual detail', [
    [0.36, 0.60], [0.44, 0.60], [0.44, 0.66], [0.36, 0.66]
  ]),
  region('Dd22', 'Dd', 'Upper-left whisker unusual detail', [
    [0.30, 0.24], [0.42, 0.24], [0.42, 0.32], [0.30, 0.32]
  ]),
  region('Dd23', 'Dd', 'Top-left small unusual detail', [
    [0.42, 0.16], [0.48, 0.16], [0.48, 0.24], [0.42, 0.24]
  ]),
  region('Dd24', 'Dd', 'Left outer side unusual detail', [
    [0.20, 0.42], [0.32, 0.42], [0.32, 0.52], [0.20, 0.52]
  ]),
  region('Dd25', 'Dd', 'Right inner-upper unusual detail', [
    [0.56, 0.30], [0.64, 0.30], [0.64, 0.38], [0.56, 0.38]
  ]),
  region('Dd26', 'Dd', 'Upper-right whisker unusual detail', [
    [0.58, 0.24], [0.70, 0.24], [0.70, 0.32], [0.58, 0.32]
  ]),
  region('Dd27', 'Dd', 'Lower-right small unusual detail', [
    [0.56, 0.60], [0.64, 0.60], [0.64, 0.66], [0.56, 0.66]
  ]),
  region('Dd28', 'Dd', 'Lower-left edge unusual detail', [
    [0.24, 0.56], [0.34, 0.56], [0.34, 0.64], [0.24, 0.64]
  ]),
  region('Dd29', 'Dd', 'Right outer side unusual detail', [
    [0.68, 0.46], [0.80, 0.46], [0.80, 0.56], [0.68, 0.56]
  ]),
  region('Dd31', 'Dd', 'Upper-right inner stem unusual detail', [
    [0.52, 0.26], [0.60, 0.26], [0.60, 0.36], [0.52, 0.36]
  ]),
  region('Dd32', 'Dd', 'Center small unusual detail', [
    [0.47, 0.36], [0.53, 0.36], [0.53, 0.44], [0.47, 0.44]
  ]),
  region('Dd33', 'Dd', 'Bottom-center unusual detail', [
    [0.46, 0.62], [0.54, 0.62], [0.54, 0.68], [0.46, 0.68]
  ]),
  region('DdS30', 'DdS', 'Lower-center white/edge space', [
    [0.46, 0.58], [0.54, 0.58], [0.54, 0.66], [0.46, 0.66]
  ])
]);

const VII = card('VII', 'Starter map from Figure A.7 + Card VII photo; verify before clinical use.', [
  region('W', 'W', 'Whole blot', [
    [0.28, 0.26], [0.38, 0.24], [0.42, 0.34], [0.50, 0.40], [0.58, 0.34],
    [0.62, 0.24], [0.72, 0.26], [0.74, 0.40], [0.70, 0.52], [0.62, 0.62],
    [0.50, 0.64], [0.38, 0.62], [0.30, 0.52], [0.26, 0.40]
  ], 'Whole blot'),
  region('D1', 'D', 'Upper-left common detail', [
    [0.28, 0.24], [0.42, 0.24], [0.44, 0.40], [0.30, 0.42]
  ]),
  region('D2', 'D', 'Upper-right common detail', [
    [0.58, 0.24], [0.72, 0.24], [0.70, 0.42], [0.56, 0.40]
  ]),
  region('D3', 'D', 'Right middle common detail', [
    [0.56, 0.38], [0.74, 0.38], [0.72, 0.54], [0.54, 0.52]
  ]),
  region('D4', 'D', 'Lower combined common detail', [
    [0.32, 0.52], [0.68, 0.52], [0.64, 0.64], [0.36, 0.64]
  ]),
  region('D5', 'D', 'Upper-right dark common detail', [
    [0.58, 0.24], [0.70, 0.24], [0.68, 0.36], [0.58, 0.36]
  ]),
  region('D6', 'D', 'Lower-center common detail', [
    [0.40, 0.54], [0.60, 0.54], [0.60, 0.64], [0.40, 0.64]
  ]),
  region('D8', 'D', 'Upper-left lighter common detail', [
    [0.30, 0.28], [0.42, 0.28], [0.44, 0.42], [0.32, 0.44]
  ]),
  region('D9', 'D', 'Left mid dark common detail', [
    [0.32, 0.36], [0.44, 0.36], [0.44, 0.48], [0.32, 0.48]
  ]),
  region('DS7', 'S', 'Large upper/central white space', [
    [0.34, 0.34], [0.66, 0.34], [0.66, 0.54], [0.34, 0.54]
  ]),
  region('DS10', 'S', 'Central white space between sides', [
    [0.40, 0.40], [0.60, 0.40], [0.60, 0.54], [0.40, 0.54]
  ]),
  region('Dd21', 'Dd', 'Far-left small unusual detail', [
    [0.24, 0.40], [0.30, 0.40], [0.30, 0.46], [0.24, 0.46]
  ]),
  region('Dd22', 'Dd', 'Left inner unusual detail', [
    [0.34, 0.34], [0.42, 0.34], [0.42, 0.42], [0.34, 0.42]
  ]),
  region('Dd23', 'Dd', 'Lower-center join unusual detail', [
    [0.46, 0.50], [0.54, 0.50], [0.54, 0.58], [0.46, 0.58]
  ]),
  region('Dd24', 'Dd', 'Right inner unusual detail', [
    [0.58, 0.38], [0.66, 0.38], [0.66, 0.46], [0.58, 0.46]
  ]),
  region('Dd25', 'Dd', 'Lower inner white-edge unusual detail', [
    [0.44, 0.52], [0.56, 0.52], [0.56, 0.58], [0.44, 0.58]
  ]),
  region('Dd26', 'Dd', 'Lower-left inner unusual detail', [
    [0.38, 0.56], [0.46, 0.56], [0.46, 0.62], [0.38, 0.62]
  ]),
  region('Dd27', 'Dd', 'Lower-right inner unusual detail', [
    [0.54, 0.56], [0.62, 0.56], [0.62, 0.62], [0.54, 0.62]
  ]),
  region('Dd28', 'Dd', 'Bottom-center unusual detail', [
    [0.46, 0.58], [0.54, 0.58], [0.54, 0.64], [0.46, 0.64]
  ])
]);

const VIII = card('VIII', 'Starter map from Figure A.8 + Card VIII photo; verify before clinical use.', [
  region('W', 'W', 'Whole blot', [
    [0.22, 0.42], [0.34, 0.30], [0.50, 0.24], [0.66, 0.30], [0.78, 0.42],
    [0.80, 0.56], [0.70, 0.68], [0.50, 0.74], [0.30, 0.68], [0.20, 0.56]
  ], 'Whole blot'),
  region('D1', 'D', 'Right pink animal common detail', [
    [0.68, 0.38], [0.82, 0.40], [0.82, 0.62], [0.68, 0.60]
  ]),
  region('D2', 'D', 'Lower pink/orange common detail', [
    [0.32, 0.58], [0.68, 0.58], [0.66, 0.74], [0.34, 0.74]
  ]),
  region('D3', 'D', 'Upper gray/blue common detail', [
    [0.36, 0.28], [0.64, 0.28], [0.64, 0.48], [0.36, 0.48]
  ]),
  region('D4', 'D', 'Left blue/rib common detail', [
    [0.34, 0.40], [0.50, 0.40], [0.50, 0.58], [0.34, 0.58]
  ]),
  region('D5', 'D', 'Right blue/rib common detail', [
    [0.50, 0.40], [0.66, 0.40], [0.66, 0.58], [0.50, 0.58]
  ]),
  region('D6', 'D', 'Top gray common detail', [
    [0.44, 0.24], [0.56, 0.24], [0.56, 0.36], [0.44, 0.36]
  ]),
  region('D7', 'D', 'Lower-left orange common detail', [
    [0.30, 0.60], [0.48, 0.60], [0.48, 0.74], [0.30, 0.74]
  ]),
  region('D8', 'D', 'D4+D5 combined (both blue/rib sides)', [
    [0.34, 0.40], [0.66, 0.40], [0.66, 0.58], [0.34, 0.58]
  ]),
  region('DS3', 'S', 'Upper inner white space (D3 or DS3)', [
    [0.42, 0.30], [0.58, 0.30], [0.58, 0.46], [0.42, 0.46]
  ]),
  region('Dd21', 'Dd', 'Top-center unusual detail', [
    [0.47, 0.24], [0.53, 0.24], [0.53, 0.32], [0.47, 0.32]
  ]),
  region('Dd22', 'Dd', 'Left upper-side unusual detail', [
    [0.28, 0.36], [0.38, 0.36], [0.38, 0.46], [0.28, 0.46]
  ]),
  region('Dd23', 'Dd', 'Lower-left small unusual detail', [
    [0.36, 0.62], [0.44, 0.62], [0.44, 0.70], [0.36, 0.70]
  ]),
  region('Dd24', 'Dd', 'Upper-center small unusual detail', [
    [0.47, 0.32], [0.53, 0.32], [0.53, 0.40], [0.47, 0.40]
  ]),
  region('Dd25', 'Dd', 'Right inner unusual detail', [
    [0.60, 0.44], [0.68, 0.44], [0.68, 0.54], [0.60, 0.54]
  ]),
  region('Dd26', 'Dd', 'Lower-right small unusual detail', [
    [0.66, 0.62], [0.74, 0.62], [0.74, 0.70], [0.66, 0.70]
  ]),
  region('Dd27', 'Dd', 'Right inner-upper unusual detail', [
    [0.54, 0.36], [0.64, 0.36], [0.64, 0.46], [0.54, 0.46]
  ]),
  region('Dd30', 'Dd', 'Top spine unusual detail', [
    [0.48, 0.24], [0.52, 0.24], [0.52, 0.36], [0.48, 0.36]
  ]),
  region('Dd31', 'Dd', 'Center spine unusual detail', [
    [0.48, 0.36], [0.52, 0.36], [0.52, 0.56], [0.48, 0.56]
  ]),
  region('Dd33', 'Dd', 'Left inner unusual detail', [
    [0.36, 0.48], [0.44, 0.48], [0.44, 0.58], [0.36, 0.58]
  ]),
  region('DdS28', 'DdS', 'Left inner white-space detail', [
    [0.32, 0.44], [0.42, 0.44], [0.42, 0.56], [0.32, 0.56]
  ]),
  region('DdS29', 'DdS', 'Lower-center white-space detail', [
    [0.46, 0.54], [0.54, 0.54], [0.54, 0.64], [0.46, 0.64]
  ]),
  region('DdS32', 'DdS', 'Right inner white-space detail', [
    [0.56, 0.44], [0.66, 0.44], [0.66, 0.56], [0.56, 0.56]
  ])
]);

const IX = card('IX', 'Starter map from Figure A.9 + Card IX photo; verify before clinical use.', [
  region('W', 'W', 'Whole blot', [
    [0.24, 0.42], [0.34, 0.30], [0.50, 0.26], [0.66, 0.30], [0.76, 0.42],
    [0.78, 0.58], [0.66, 0.70], [0.50, 0.74], [0.34, 0.70], [0.22, 0.58]
  ], 'Whole blot'),
  region('D1', 'D', 'Left orange common detail', [
    [0.22, 0.38], [0.40, 0.38], [0.40, 0.58], [0.22, 0.58]
  ]),
  region('D2', 'D', 'Right green common detail', [
    [0.58, 0.32], [0.78, 0.34], [0.78, 0.58], [0.58, 0.56]
  ]),
  region('D3', 'D', 'Upper-left green/orange common detail', [
    [0.28, 0.28], [0.46, 0.28], [0.46, 0.42], [0.28, 0.42]
  ]),
  region('D4', 'D', 'Lower-left pink common detail', [
    [0.24, 0.56], [0.42, 0.56], [0.42, 0.70], [0.24, 0.70]
  ]),
  region('D5', 'D', 'Lower-right inner common detail', [
    [0.54, 0.58], [0.70, 0.58], [0.70, 0.72], [0.54, 0.72]
  ]),
  region('D6', 'D', 'Lower pink common detail', [
    [0.34, 0.58], [0.66, 0.58], [0.64, 0.74], [0.36, 0.74]
  ]),
  region('D8', 'D', 'Center inner (D8 or DS8)', [
    [0.42, 0.36], [0.58, 0.36], [0.58, 0.56], [0.42, 0.56]
  ]),
  region('D9', 'D', 'Lower-right pink common detail', [
    [0.58, 0.58], [0.76, 0.58], [0.74, 0.72], [0.58, 0.72]
  ]),
  region('D11', 'D', 'Both D1 areas combined', [
    [0.22, 0.36], [0.78, 0.36], [0.78, 0.58], [0.22, 0.58]
  ]),
  region('D12', 'D', 'Upper-right orange common detail', [
    [0.58, 0.28], [0.76, 0.30], [0.76, 0.46], [0.58, 0.44]
  ]),
  region('DS8', 'S', 'Center white space (D8 or DS8)', [
    [0.44, 0.38], [0.56, 0.38], [0.56, 0.54], [0.44, 0.54]
  ]),
  region('Dd21', 'Dd', 'Lower-right small unusual detail', [
    [0.64, 0.64], [0.74, 0.64], [0.74, 0.72], [0.64, 0.72]
  ]),
  region('Dd22', 'Dd', 'Right inner unusual detail (or DdS22)', [
    [0.56, 0.44], [0.66, 0.44], [0.66, 0.54], [0.56, 0.54]
  ]),
  region('Dd24', 'Dd', 'Right mid small unusual detail', [
    [0.62, 0.48], [0.70, 0.48], [0.70, 0.56], [0.62, 0.56]
  ]),
  region('Dd25', 'Dd', 'Upper-left inner unusual detail', [
    [0.36, 0.30], [0.44, 0.30], [0.44, 0.38], [0.36, 0.38]
  ]),
  region('Dd26', 'Dd', 'Upper-right inner unusual detail', [
    [0.56, 0.30], [0.64, 0.30], [0.64, 0.38], [0.56, 0.38]
  ]),
  region('Dd27', 'Dd', 'Upper-left small unusual detail', [
    [0.32, 0.32], [0.40, 0.32], [0.40, 0.40], [0.32, 0.40]
  ]),
  region('Dd28', 'Dd', 'Right inner-upper unusual detail', [
    [0.58, 0.42], [0.66, 0.42], [0.66, 0.50], [0.58, 0.50]
  ]),
  region('Dd30', 'Dd', 'Lower-right edge unusual detail', [
    [0.60, 0.62], [0.72, 0.62], [0.72, 0.70], [0.60, 0.70]
  ]),
  region('Dd31', 'Dd', 'Lower-left inner unusual detail', [
    [0.32, 0.58], [0.44, 0.58], [0.44, 0.68], [0.32, 0.68]
  ]),
  region('Dd33', 'Dd', 'Lower-right inner unusual detail', [
    [0.56, 0.56], [0.66, 0.56], [0.66, 0.66], [0.56, 0.66]
  ]),
  region('Dd34', 'Dd', 'Upper-right small unusual detail', [
    [0.58, 0.28], [0.66, 0.28], [0.66, 0.34], [0.58, 0.34]
  ]),
  region('Dd35', 'Dd', 'Lower-center unusual detail', [
    [0.44, 0.60], [0.56, 0.60], [0.56, 0.70], [0.44, 0.70]
  ]),
  region('DdS22', 'DdS', 'Right inner white space', [
    [0.54, 0.42], [0.64, 0.42], [0.64, 0.54], [0.54, 0.54]
  ]),
  region('DdS23', 'DdS', 'Left inner white space', [
    [0.36, 0.44], [0.46, 0.44], [0.46, 0.56], [0.36, 0.56]
  ]),
  region('DdS29', 'DdS', 'Left mid small space detail', [
    [0.34, 0.46], [0.42, 0.46], [0.42, 0.54], [0.34, 0.54]
  ]),
  region('DdS32', 'DdS', 'Upper inner white space', [
    [0.42, 0.28], [0.58, 0.28], [0.58, 0.40], [0.42, 0.40]
  ])
]);

const X = card('X', 'Starter map from Figure A.10 + Card X photo; verify before clinical use.', [
  region('W', 'W', 'Whole blot', [
    [0.08, 0.40], [0.22, 0.32], [0.40, 0.28], [0.50, 0.24], [0.60, 0.28],
    [0.78, 0.32], [0.92, 0.40], [0.88, 0.58], [0.70, 0.66], [0.50, 0.70],
    [0.30, 0.66], [0.12, 0.58]
  ], 'Whole blot'),
  region('D1', 'D', 'Left outer blue common detail', [
    [0.06, 0.34], [0.28, 0.34], [0.28, 0.50], [0.06, 0.50]
  ]),
  region('D2', 'D', 'Lower pink common detail (right/inner)', [
    [0.50, 0.48], [0.68, 0.48], [0.66, 0.68], [0.50, 0.66]
  ]),
  region('D3', 'D', 'Upper-center gray common detail', [
    [0.44, 0.26], [0.56, 0.26], [0.56, 0.40], [0.44, 0.40]
  ]),
  region('D4', 'D', 'Lower-center green common detail', [
    [0.44, 0.58], [0.56, 0.58], [0.56, 0.70], [0.44, 0.70]
  ]),
  region('D5', 'D', 'Lower inner yellow/pink common detail', [
    [0.46, 0.52], [0.54, 0.52], [0.54, 0.62], [0.46, 0.62]
  ]),
  region('D6', 'D', 'Right inner blue/gray common detail', [
    [0.56, 0.34], [0.70, 0.34], [0.70, 0.50], [0.56, 0.50]
  ]),
  region('D7', 'D', 'Left yellow/brown common detail', [
    [0.16, 0.48], [0.32, 0.48], [0.32, 0.60], [0.16, 0.60]
  ]),
  region('D8', 'D', 'Upper-right gray common detail', [
    [0.54, 0.26], [0.66, 0.26], [0.66, 0.38], [0.54, 0.38]
  ]),
  region('D9', 'D', 'Left pink common detail', [
    [0.32, 0.40], [0.48, 0.40], [0.48, 0.64], [0.32, 0.64]
  ]),
  region('D10', 'D', 'Lower-right orange common detail', [
    [0.72, 0.56], [0.90, 0.56], [0.88, 0.68], [0.72, 0.66]
  ]),
  region('D11', 'D', 'Top-center gray common detail', [
    [0.46, 0.24], [0.54, 0.24], [0.54, 0.34], [0.46, 0.34]
  ]),
  region('D12', 'D', 'Right yellow common detail', [
    [0.68, 0.46], [0.84, 0.46], [0.84, 0.58], [0.68, 0.58]
  ]),
  region('D13', 'D', 'Far-left orange common detail', [
    [0.06, 0.50], [0.18, 0.50], [0.18, 0.64], [0.06, 0.64]
  ]),
  region('D14', 'D', 'Top spike common detail', [
    [0.48, 0.22], [0.52, 0.22], [0.52, 0.32], [0.48, 0.32]
  ]),
  region('D15', 'D', 'Far-right green common detail', [
    [0.82, 0.40], [0.94, 0.40], [0.94, 0.54], [0.82, 0.54]
  ]),
  region('Dd21', 'Dd', 'Top-center small unusual detail', [
    [0.48, 0.24], [0.52, 0.24], [0.52, 0.30], [0.48, 0.30]
  ]),
  region('Dd25', 'Dd', 'Upper-right inner unusual detail', [
    [0.58, 0.32], [0.68, 0.32], [0.68, 0.40], [0.58, 0.40]
  ]),
  region('Dd26', 'Dd', 'Left inner unusual detail', [
    [0.34, 0.50], [0.42, 0.50], [0.42, 0.58], [0.34, 0.58]
  ]),
  region('Dd27', 'Dd', 'Right outer blue unusual detail', [
    [0.72, 0.32], [0.90, 0.32], [0.90, 0.48], [0.72, 0.48]
  ]),
  region('Dd28', 'Dd', 'Right inner small unusual detail', [
    [0.70, 0.40], [0.80, 0.40], [0.80, 0.50], [0.70, 0.50]
  ]),
  region('Dd31', 'Dd', 'Lower-left pink-edge unusual detail', [
    [0.30, 0.60], [0.40, 0.60], [0.40, 0.68], [0.30, 0.68]
  ]),
  region('Dd32', 'Dd', 'Right inner-lower unusual detail', [
    [0.60, 0.48], [0.70, 0.48], [0.70, 0.56], [0.60, 0.56]
  ]),
  region('Dd33', 'Dd', 'Lower-right inner unusual detail', [
    [0.58, 0.58], [0.68, 0.58], [0.68, 0.66], [0.58, 0.66]
  ]),
  region('Dd34', 'Dd', 'Left inner-lower unusual detail', [
    [0.34, 0.54], [0.44, 0.54], [0.44, 0.62], [0.34, 0.62]
  ]),
  region('Dd35', 'Dd', 'Left outer-upper unusual detail', [
    [0.10, 0.34], [0.20, 0.34], [0.20, 0.42], [0.10, 0.42]
  ]),
  region('DdS22', 'DdS', 'Upper inner white space', [
    [0.42, 0.30], [0.58, 0.30], [0.58, 0.46], [0.42, 0.46]
  ]),
  region('DdS29', 'DdS', 'Center inner white space', [
    [0.44, 0.40], [0.56, 0.40], [0.56, 0.54], [0.44, 0.54]
  ]),
  region('DdS30', 'DdS', 'Right inner white-space detail', [
    [0.58, 0.40], [0.68, 0.40], [0.68, 0.52], [0.58, 0.52]
  ])
]);

const maps = { II, III, V, VI, VII, VIII, IX, X };
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(dir, 'starter-maps-ii-x.json'), JSON.stringify(maps, null, 2));
console.log(Object.fromEntries(Object.entries(maps).map(([k, v]) => [k, v.regions.length])));
