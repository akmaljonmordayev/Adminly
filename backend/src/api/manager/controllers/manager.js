'use strict';

/**
 * manager controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::manager.manager');
