// @ts-nocheck
export default {
  type: 'content-api',
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
};