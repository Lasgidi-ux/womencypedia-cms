// @ts-nocheck
export default {
  type: 'content-api',
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
};