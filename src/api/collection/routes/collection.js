'use strict';

/**
 * collection router
 *
 * Explicitly defines routes for collection type.
 */

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/collections',
      handler: 'collection.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/collections/:id',
      handler: 'collection.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
