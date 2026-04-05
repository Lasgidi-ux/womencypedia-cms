// @ts-nocheck
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/biographies',
      handler: 'biography.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/biographies/:id',
      handler: 'biography.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
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
};
