import { Page } from '@playwright/test'

const EMPTY_SELECTION_DATA = {
  selected_correspondents: [],
  selected_tags: [],
  selected_document_types: [],
  selected_storage_paths: [],
  selected_custom_fields: [],
}

/**
 * The document list now fires a GET to filter_selection_data on every
 * non-search reload(), independent of and concurrent with the main list
 * request. It's not present in any of the recorded HAR fixtures, so with
 * `notFound: 'fallback'` it would otherwise fall through to the real
 * network (nothing listens there in e2e, since only the frontend dev
 * server is started) and fail every test that reloads the list.
 *
 * Playwright checks routes in reverse-registration order, so this must be
 * registered before a test's own page.routeFromHAR() call for the HAR
 * route's `notFound: 'fallback'` to defer back to this one.
 */
export async function mockFilterSelectionData(page: Page) {
  await page.route('**/api/documents/filter_selection_data/**', (route) =>
    route.fulfill({
      json: EMPTY_SELECTION_DATA,
      // The app calls the (cross-origin, from the e2e app's perspective)
      // backend at http://localhost:8000 while served from :4200, so a
      // fulfilled response needs the same CORS header the real backend
      // sends (and that recorded HAR responses already carry) or the
      // browser rejects it as a cross-origin failure.
      headers: { 'Access-Control-Allow-Origin': 'http://localhost:4200' },
    })
  )
}
