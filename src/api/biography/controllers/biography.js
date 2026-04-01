'use strict';

/**
 * biography controller
 * 
 * Uses Strapi v5 core controller for standard CRUD operations.
 * The standard find/findOne/create/update/delete actions are automatically available.
 * Frontend filtering (by slug, region, category, etc.) is done via Strapi's query parameters.
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::biography.biography');
