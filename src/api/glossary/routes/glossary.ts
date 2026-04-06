// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::glossary.glossary', {
  only: [],
  except: ['find', 'findOne'],
  config: {},
  routes: [
    {
      method: 'GET',
      path: '/glossary-terms',
      handler: 'glossary.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/glossary-terms/:id',
      handler: 'glossary.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});