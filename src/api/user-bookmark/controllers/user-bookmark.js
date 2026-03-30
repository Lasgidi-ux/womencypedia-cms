'use strict';

/**
 * user-bookmark controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-bookmark.user-bookmark', ({ strapi }) => ({
  // Get user's bookmarks
  async find(ctx) {
    // Only allow authenticated users to see their own bookmarks
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated');
    }

    ctx.query.filters = {
      ...ctx.query.filters,
      user: ctx.state.user.id
    };

    // Populate biography data
    ctx.query.populate = {
      biography: {
        populate: ['image', 'tags']
      }
    };

    return await super.find(ctx);
  },

  // Create bookmark
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated');
    }

    // Set the user and timestamp
    ctx.request.body.data.user = ctx.state.user.id;
    ctx.request.body.data.bookmarkedAt = new Date();

    // Check if bookmark already exists
    const existing = await strapi.entityService.findMany('api::user-bookmark.user-bookmark', {
      filters: {
        user: ctx.state.user.id,
        biography: ctx.request.body.data.biography
      }
    });

    if (existing.length > 0) {
      return ctx.badRequest('Bookmark already exists');
    }

    return await super.create(ctx);
  },

  // Delete bookmark
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated');
    }

    // Ensure user can only delete their own bookmarks
    const bookmark = await strapi.entityService.findOne('api::user-bookmark.user-bookmark', ctx.params.id, {
      populate: ['user']
    });

    if (!bookmark || bookmark.user.id !== ctx.state.user.id) {
      return ctx.forbidden('You can only delete your own bookmarks');
    }

    return await super.delete(ctx);
  },

  // Delete all user's bookmarks
  async deleteAll(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated');
    }

    const deletedCount = await strapi.entityService.deleteMany('api::user-bookmark.user-bookmark', {
      filters: { user: ctx.state.user.id }
    });

    ctx.send({
      message: 'All bookmarks deleted',
      deletedCount
    });
  }
}));
