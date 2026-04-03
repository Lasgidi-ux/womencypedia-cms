'use strict';

/**
 * biography router
 *
 * Explicitly defines routes for biography collection type.
 * Public permissions are managed via Settings > Roles > Public in the admin panel.
 */

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/biographies',
      handler: 'biography.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/biographies/:id',
      handler: 'biography.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
