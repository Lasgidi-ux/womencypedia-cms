'use strict';

/**
 * homepage router
 *
 * Explicitly defines routes for the homepage single type.
 * Public permissions are managed via Settings > Roles > Public in the admin panel.
 */

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/homepage',
      handler: 'homepage.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
