'use strict';

/**
 * teaching-resource service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::teaching-resource.teaching-resource');