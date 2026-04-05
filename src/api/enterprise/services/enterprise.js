// @ts-nocheck
'use strict';

/**
 * enterprise service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::enterprise.enterprise');