import carpentryContent from '@/content/carpentry.json'
import type { OccupationContent } from '@/content/types'

/**
 * Active occupation identifier.
 * To switch occupations, change this constant and add the corresponding JSON file.
 * No other code changes are needed.
 */
export const OCCUPATION = 'carpentry'

/**
 * Content for the active occupation, typed against OccupationContent.
 * All screen components and pages import from here -- never directly from a JSON file.
 */
export const content = carpentryContent as OccupationContent
