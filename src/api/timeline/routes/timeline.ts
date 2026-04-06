// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::timeline.timeline', {
  only: [],
  except: ['find', 'findOne'],
  config: {},
  routes: [
    {
      method: 'GET',
      path: '/timeline-events',
      handler: 'timeline.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/timeline-events/:id',
      handler: 'timeline.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});