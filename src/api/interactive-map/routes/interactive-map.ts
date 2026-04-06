// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::interactive-map.interactive-map', {
  only: [],
  except: ['find', 'findOne'],
  config: {},
  routes: [
    {
      method: 'GET',
      path: '/maps',
      handler: 'interactive-map.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/maps/:id',
      handler: 'interactive-map.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});