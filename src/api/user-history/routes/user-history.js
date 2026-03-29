'use strict';

/**
 * user-history router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::user-history.user-history', {
  config: {
    find: {
      policies: ['global::isAuthenticated']
    },
    create: {
      policies: ['global::isAuthenticated']
    },
    sync: {
      methods: ['POST'],
      path: '/user-history/sync',
      handler: 'user-history.sync',
      config: {
        policies: ['global::isAuthenticated']
      }
    }
  }
});