/**
 * Single entry point for everything the UI shows.
 * - HABITAT_PRESETS: values from the project brief.
 * - PSI: generated at build time from data/psi_combustion_records.csv
 *   and data/stated-conditions.json by scripts/build-data.mjs.
 */
import PSI from './generated/psi.json';

export { PSI };

/**
 * @typedef {Object} HabitatPreset
 * @property {string} id
 * @property {string} label
 * @property {number} pressurePsia
 * @property {number} o2Percent
 * @property {string|null} inlineFlag  Caveat shown on the button.
 */

/** @type {HabitatPreset[]} */
export const HABITAT_PRESETS = [
  { id: 'sea-level', label: 'Sea level', pressurePsia: 14.7, o2Percent: 21, inlineFlag: null },
  { id: 'lunar-a', label: 'Lunar habitat A', pressurePsia: 10.2, o2Percent: 26.5, inlineFlag: null },
  { id: 'lunar-b', label: 'Lunar habitat B', pressurePsia: 10.2, o2Percent: 30, inlineFlag: null },
  { id: 'lunar-c', label: 'Lunar habitat C', pressurePsia: 8.2, o2Percent: 34, inlineFlag: null },
  { id: 'spacesuit', label: 'Spacesuit', pressurePsia: 4.3, o2Percent: 100, inlineFlag: 'another NASA source lists 85%' },
];

export const recordByAcc = new Map(PSI.records.map((r) => [r.accession, r]));
export const conditionById = new Map(PSI.conditions.map((c) => [c.id, c]));

/** Stated conditions that literally name this preset's atmosphere (used as the preset's source). */
export function presetSources(preset) {
  return PSI.conditions.filter(
    (c) =>
      c.kind === 'point' &&
      Math.abs(c.pressurePsia.value - preset.pressurePsia) < 0.05 &&
      Math.abs(c.o2.value - preset.o2Percent) < 0.05,
  );
}
