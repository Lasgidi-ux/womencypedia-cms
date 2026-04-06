// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::teaching-resource.teaching-resource', {
  only: [],
  except: ['find', 'findOne'],
  config: {},
  routes: [
    {
      method: 'GET',
      path: '/teaching-resources',
      handler: 'teaching-resource.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/teaching-resources/:id',
      handler: 'teaching-resource.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/downloadable-resources',
      handler: 'teaching-resource.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/downloadable-resources/:id',
      handler: 'teaching-resource.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});
