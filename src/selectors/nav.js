
export const navOrg = (state, org) => state.navStore.orgs && state.navStore.orgs[org]
export const cobrand = (state) => state.navStore.partnerCobrand
export const orgCobrand = (state, org) =>
  (org ? navOrg(state, org) : cobrand(state))

