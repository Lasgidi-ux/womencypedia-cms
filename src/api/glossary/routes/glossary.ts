// @ts-nocheck
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/glossaries',
      handler: 'glossary.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/glossaries/:id',
      handler: 'glossary.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};