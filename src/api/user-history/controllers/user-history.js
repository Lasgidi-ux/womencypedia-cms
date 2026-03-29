'use strict';

/**
 * user-history controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-history.user-history', ({ strapi }) => ({
  // Get user's reading history
  async find(ctx) {
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

    // Sort by most recent first
    ctx.query.sort = 'readAt:desc';

    return await super.find(ctx);
  },

  // Create/update history entry
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated');
    }

    ctx.request.body.data.user = ctx.state.user.id;

    // Check if history entry already exists for this biography
    const existing = await strapi.entityService.findMany('api::user-history.user-history', {
      filters: {
        user: ctx.state.user.id,
        biography: ctx.request.body.data.biography
      }
    });

    if (existing.length > 0) {
      // Update existing entry
      const updatedData = {
        ...ctx.request.body.data,
        // Merge progress (keep higher value)
        readProgress: Math.max(existing[0].readProgress, ctx.request.body.data.readProgress),
        // Add to duration
        readDuration: existing[0].readDuration + (ctx.request.body.data.readDuration || 0)
      };

      return await strapi.entityService.update('api::user-history.user-history', existing[0].id, {
        data: updatedData
      });
    }

    return await super.create(ctx);
  },

  // Sync history (bulk upsert)
  async sync(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated');
    }

    const { history } = ctx.request.body;
    const userId = ctx.state.user.id;

    if (!Array.isArray(history)) {
      return ctx.badRequest('History must be an array');
    }

    const results = [];
    let created = 0;
    let updated = 0;

    for (const item of history) {
      try {
        // Find existing entry
        const existing = await strapi.entityService.findMany('api::user-history.user-history', {
          filters: {
            user: userId,
            biography: item.id
          }
        });

        if (existing.length > 0) {
          // Update existing - keep higher progress
          const updatedEntry = await strapi.entityService.update('api::user-history.user-history', existing[0].id, {
            data: {
              readProgress: Math.max(existing[0].readProgress, item.readProgress || 0),
              readDuration: Math.max(existing[0].readDuration, item.readDuration || 0),
              readAt: item.readAt || new Date()
            }
          });
          results.push(updatedEntry);
          updated++;
        } else {
          // Create new
          const createdEntry = await strapi.entityService.create('api::user-history.user-history', {
            data: {
              user: userId,
              biography: item.id,
              readAt: item.readAt || new Date(),
              readProgress: item.readProgress || 0,
              readDuration: item.readDuration || 0
            }
          });
          results.push(createdEntry);
          created++;
        }
      } catch (error) {
        console.error('Error syncing history item:', error);
      }
    }

    ctx.send({
      message: 'History synced successfully',
      synced: results.length,
      created,
      updated
    });
  }
}));