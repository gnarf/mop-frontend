const { Promise } = global


// This file should map lazy-loading components in the app.

// A good example is the Thanks page, where we don't want to burden the first
// load with thanks-page data but once we have loaded the rest, we should
// take an opportunity to load the thanks page javascript so that when they
// sign the petition it will quickly render the thanks page.

// This works because require() is async, and NOT imported at the top.
// Note that this will not work for full page components because the route
// needs to reference the component, but for async pages, just make a stub page
// component, and put the rest of the logic inside a src/components
// (sub) component


export const thanksLoader = () => new Promise(resolve => {
  require.ensure([], () => {
    resolve({
      // eslint-disable-next-line global-require
      Thanks: require('../components/thanks.js')
    })
  })
})

export const searchLoader = () => new Promise(resolve => {
  require.ensure([], () => {
    resolve({
      // eslint-disable-next-line global-require
      Search: require('../components/search.js')
    })
  })
})
