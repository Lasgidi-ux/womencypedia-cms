// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::research-tool.research-tool', {
  only: [],
  except: ['find', 'findOne'],
  config: {},
  routes: [
    {
      method: 'GET',
      path: '/research-tools',
      handler: 'research-tool.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/research-tools/:id',
      handler: 'research-tool.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});