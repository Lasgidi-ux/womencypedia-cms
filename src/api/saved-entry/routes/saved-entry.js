'use strict';

/**
 * saved-entry router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::saved-entry.saved-entry', {
  config: {
    find: {
      policies: ['global::isAuthenticated']
    },
    create: {
      policies: ['global::isAuthenticated']
    },
    delete: {
      policies: ['global::isAuthenticated']
    }
  }
});
