// @ts-nocheck
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/interactive-maps',
      handler: 'interactive-map.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/interactive-maps/:id',
      handler: 'interactive-map.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};