'use strict';

/**
 * user-bookmark router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::user-bookmark.user-bookmark', {
  config: {
    find: {
      policies: ['global::isAuthenticated']
    },
    create: {
      policies: ['global::isAuthenticated']
    },
    delete: {
      policies: ['global::isAuthenticated']
    },
    deleteAll: {
      policies: ['global::isAuthenticated'],
      methods: ['DELETE']
    }
  }
});
