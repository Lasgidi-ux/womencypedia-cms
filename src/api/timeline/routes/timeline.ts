// @ts-nocheck
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/timelines',
      handler: 'timeline.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/timelines/:id',
      handler: 'timeline.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};