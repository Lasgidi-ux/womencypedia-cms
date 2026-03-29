'use strict';

/**
 * user-history service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-history.user-history');