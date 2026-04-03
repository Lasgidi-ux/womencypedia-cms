'use strict';

/**
 * homepage router
 *
 * Uses Strapi v5 createCoreRouter for automatic route generation.
 * Public permissions are managed via Settings > Roles > Public in the admin panel.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::homepage.homepage');
