// @ts-nocheck
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/homepage',
      handler: 'homepage.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
