import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   * 
   * Note: In Strapi v5, API routes are auto-loaded from src/api/[name]/routes/
   * using createCoreRouter(). We no longer need to manually register routes here.
   */
  register({ strapi }: { strapi: any }) {
    strapi.log.info('[Register] Strapi v5 will auto-load API routes from src/api/*/routes/');
  },

  /**
   * Bootstrap: auto-create locales and set up public permissions
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ── Auto-create locales matching the frontend locale files ──
    const localesToCreate = [
      { name: 'French', code: 'fr' },
      { name: 'Spanish', code: 'es' },
      { name: 'Portuguese', code: 'pt' },
      { name: 'Arabic', code: 'ar' },
      { name: 'Swahili', code: 'sw' },
      { name: 'Yoruba', code: 'yo' },
      { name: 'Hausa', code: 'ha' },
      { name: 'Hindi', code: 'hi' },
      { name: 'Chinese', code: 'zh' },
    ];

    try {
      const localeService = strapi.plugin('i18n')?.service('locales');
      if (!localeService) {
        strapi.log.warn('[Bootstrap] i18n plugin not found — skipping locale creation');
      } else {
        const existingLocales = await localeService.find();
        const existingCodes = existingLocales.map((l: any) => l.code);

        for (const locale of localesToCreate) {
          if (!existingCodes.includes(locale.code)) {
            strapi.log.info(`[Bootstrap] Creating locale: ${locale.name} (${locale.code})`);
            await localeService.create(locale);
          }
        }

        strapi.log.info(`[Bootstrap] Locales ready`);
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error auto-creating locales:', err);
    }

    // ── Set up public API permissions using Strapi v5 format ──
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (!publicRole) {
        strapi.log.warn('[Bootstrap] Public role not found, skipping permissions setup');
        return;
      }

      strapi.log.info(`[Bootstrap] Found public role: ${publicRole.id}`);

      // In Strapi v5, the permission action format is: api::<contentType>.<controller>.<action>
      // e.g., api::biography.biography.find
      const publicReadPermissions = [
        // Biography
        { action: 'api::biography.biography.find' },
        { action: 'api::biography.biography.findOne' },
        // Collection
        { action: 'api::collection.collection.find' },
        { action: 'api::collection.collection.findOne' },
        // Homepage (single type)
        { action: 'api::homepage.homepage.find' },
        // Education Module
        { action: 'api::education-module.education-module.find' },
        { action: 'api::education-module.education-module.findOne' },
        // Fellowship
        { action: 'api::fellowship.fellowship.find' },
        { action: 'api::fellowship.fellowship.findOne' },
        // Leader
        { action: 'api::leader.leader.find' },
        { action: 'api::leader.leader.findOne' },
        // Partner
        { action: 'api::partner.partner.find' },
        { action: 'api::partner.partner.findOne' },
        // Tag
        { action: 'api::tag.tag.find' },
        { action: 'api::tag.tag.findOne' },
        // Teaching Resource
        { action: 'api::teaching-resource.teaching-resource.find' },
        { action: 'api::teaching-resource.teaching-resource.findOne' },
      ];

      const publicSubmitPermissions = [
        // Contribution (public can create)
        { action: 'api::contribution.contribution.find' },
        { action: 'api::contribution.contribution.findOne' },
        { action: 'api::contribution.contribution.create' },
        // Nomination (public can create)
        { action: 'api::nomination.nomination.create' },
        // Contact Submission (public can create)
        { action: 'api::contact-submission.contact-submission.create' },
      ];

      const allPermissions = [...publicReadPermissions, ...publicSubmitPermissions];

      // Get current permissions for the public role
      const existingPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
        where: { role: publicRole.id },
      });

      const existingActions = new Set(existingPermissions.map((p: any) => p.action));

      for (const perm of allPermissions) {
        if (!existingActions.has(perm.action)) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: perm.action,
              role: publicRole.id,
              enabled: true,
            },
          });
          strapi.log.info(`[Bootstrap] Added public permission: ${perm.action}`);
        }
      }

      strapi.log.info('[Bootstrap] Public API permissions configured successfully');

      // ── Set up authenticated role permissions ──
      const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (authenticatedRole) {
        const authPermissions = [
          { action: 'api::contribution.contribution.create' },
          { action: 'api::contribution.contribution.find' },
          { action: 'api::contribution.contribution.findOne' },
          { action: 'api::nomination.nomination.create' },
          { action: 'api::contact-submission.contact-submission.create' },
          { action: 'api::comment.comment.create' },
          { action: 'api::comment.comment.find' },
          { action: 'api::user-bookmark.user-bookmark.create' },
          { action: 'api::user-bookmark.user-bookmark.find' },
          { action: 'api::user-bookmark.user-bookmark.delete' },
          { action: 'api::user-history.user-history.create' },
          { action: 'api::user-history.user-history.find' },
        ];

        const existingAuthPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: { role: authenticatedRole.id },
        });

        const existingAuthActions = new Set(existingAuthPermissions.map((p: any) => p.action));

        for (const perm of authPermissions) {
          if (!existingAuthActions.has(perm.action)) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: perm.action,
                role: authenticatedRole.id,
                enabled: true,
              },
            });
            strapi.log.info(`[Bootstrap] Added authenticated permission: ${perm.action}`);
          }
        }
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error setting up permissions:', err);
    }

    // ── Create homepage single type entry if it doesn't exist ──
    try {
      // In Strapi v5, use the document service for single types
      let existingHomepage;
      try {
        existingHomepage = await strapi.documents('api::homepage.homepage').findFirst();
      } catch {
        existingHomepage = null;
      }

      if (!existingHomepage) {
        await strapi.documents('api::homepage.homepage').create({
          data: {
            heroTitle: 'Welcome to Womencypedia',
            heroSubtitle: 'Discover the stories of remarkable women throughout history',
            heroBadge: 'Empowering Voices',
            quoteText: '"The strength of a woman is not measured by the impact that all her hardships in life have had on her; but the strength of a woman is measured by the extent of her refusal to allow those hardships to dictate her and who she becomes." - C. JoyBell C.',
          },
          status: 'published',
        });
        strapi.log.info('[Bootstrap] Created default homepage entry');
      } else {
        strapi.log.info('[Bootstrap] Homepage entry already exists');
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error creating homepage entry:', err);
    }

    // ── Debug content type loading ──
    try {
      strapi.log.info('[Bootstrap] Checking content type loading...');

      // Wait a bit for content types to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 1000));

      strapi.log.info('[Bootstrap] Content type loading check completed');
    } catch (err) {
      strapi.log.error('[Bootstrap] Error during content type loading check:', err);
    }

    // ── Debug: Check content type registration ──
    try {
      strapi.log.info('[Bootstrap] Checking content type registration...');

      // Get all registered content types
      const contentTypes = Object.keys(strapi.contentTypes || {});
      strapi.log.info(`[Bootstrap] Registered content types: ${contentTypes.join(', ')}`);

      // Check specific content types
      const requiredTypes = ['api::biography.biography', 'api::collection.collection', 'api::homepage.homepage'];
      for (const type of requiredTypes) {
        if (strapi.contentTypes?.[type]) {
          strapi.log.info(`[Bootstrap] ✓ Content type ${type} is registered`);
        } else {
          strapi.log.warn(`[Bootstrap] ✗ Content type ${type} is NOT registered`);
        }
      }

      strapi.log.info('[Bootstrap] Content type check completed');
    } catch (err) {
      strapi.log.error('[Bootstrap] Error checking content types:', err);
    }
  },
};
