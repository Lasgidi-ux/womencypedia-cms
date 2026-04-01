'use strict';

/**
 * contribution router
 * 
 * Uses Strapi v5 core router for standard CRUD operations.
 * Public permissions are managed via Settings > Roles > Public in the admin panel.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::contribution.contribution');
