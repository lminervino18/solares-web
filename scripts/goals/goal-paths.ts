/**
 * Shared paths for the goals pipeline.
 *
 * These live apart from the scripts that use them so importing a constant never
 * runs another script's entry point as a side effect.
 */

/** Folder holding the web-ready clips that get uploaded. */
export const GOALS_ROOT = 'Goles/web'

export const INSPECTION_REPORT_PATH = 'data/goals/goals-inspection.generated.json'
export const DUPLICATES_REPORT_PATH = 'data/goals/goals-duplicates.generated.json'
export const UPLOAD_REPORT_PATH = 'data/goals/goals-upload-report.generated.json'
