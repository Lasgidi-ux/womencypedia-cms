// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::biography.biography', {
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
  routes: [
    {
      method: 'GET',
      path: '/preview/:documentId',
      handler: 'biography.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});
