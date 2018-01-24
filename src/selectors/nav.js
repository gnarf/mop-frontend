
/**
 * Select an organization cobranding using an org slug.
 *
 * { logo_image_url, organization, browser_url }
 */
export const navOrg = (state, org) => state.nav && state.nav.orgs && state.nav.orgs[org]

/**
 * Selects the cobranding in use from the last loaded petition, or "top petition" #1 when on that page
 * { logo_image_url, organization, browser_url }
 */
export const cobrand = (state) => state.nav.partnerCobrand

/**
 * Selects the organization cobrand by slug.
 * Defaults to the latest petitions cobrand when the org param isn't passed
 *
 * { logo_image_url, organization, browser_url }
 */
export const orgCobrand = (state, org) =>
  (org ? navOrg(state, org) : cobrand(state))

