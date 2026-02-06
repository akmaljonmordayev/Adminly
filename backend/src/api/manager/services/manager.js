'use strict';

/**
 * manager service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::manager.manager');
