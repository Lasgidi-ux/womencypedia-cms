// @ts-nocheck
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/collections',
      handler: 'collection.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/collections/:id',
      handler: 'collection.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
