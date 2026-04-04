// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::collection.collection', {
  config: {
    find: {
      policies: [],
      middlewares: [],
    },
    findOne: {
      policies: [],
      middlewares: [],
    },
  },
});
