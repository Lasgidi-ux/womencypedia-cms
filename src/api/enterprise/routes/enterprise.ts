// @ts-nocheck
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/enterprises',
      handler: 'enterprise.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/enterprises/:id',
      handler: 'enterprise.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};