// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::reading-list.reading-list', {
  only: [],
  except: ['find', 'findOne'],
  config: {},
  routes: [
    {
      method: 'GET',
      path: '/reading-lists',
      handler: 'reading-list.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/reading-lists/:id',
      handler: 'reading-list.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});