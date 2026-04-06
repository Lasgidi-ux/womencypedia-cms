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
        // Enterprise
        { action: 'api::enterprise.enterprise.find' },
        { action: 'api::enterprise.enterprise.findOne' },
        // Reading List
        { action: 'api::reading-list.reading-list.find' },
        { action: 'api::reading-list.reading-list.findOne' },
        // Glossary
        { action: 'api::glossary.glossary.find' },
        { action: 'api::glossary.glossary.findOne' },
        // Timeline
        { action: 'api::timeline.timeline.find' },
        { action: 'api::timeline.timeline.findOne' },
        // Interactive Map
        { action: 'api::interactive-map.interactive-map.find' },
        { action: 'api::interactive-map.interactive-map.findOne' },
        // Research Tool
        { action: 'api::research-tool.research-tool.find' },
        { action: 'api::research-tool.research-tool.findOne' },
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
          { action: 'api::enterprise.enterprise.find' },
          { action: 'api::enterprise.enterprise.findOne' },
          { action: 'api::reading-list.reading-list.find' },
          { action: 'api::reading-list.reading-list.findOne' },
          { action: 'api::glossary.glossary.find' },
          { action: 'api::glossary.glossary.findOne' },
          { action: 'api::timeline.timeline.find' },
          { action: 'api::timeline.timeline.findOne' },
          { action: 'api::interactive-map.interactive-map.find' },
          { action: 'api::interactive-map.interactive-map.findOne' },
          { action: 'api::research-tool.research-tool.find' },
          { action: 'api::research-tool.research-tool.findOne' },
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

    // ── Create sample enterprise entries if they don't exist ──
    try {
      strapi.log.info('[Bootstrap] Checking strapi.entityService availability...');
      strapi.log.info(`[Bootstrap] strapi.entityService exists: ${!!strapi.entityService}`);
      strapi.log.info(`[Bootstrap] strapi.entityService type: ${typeof strapi.entityService}`);

      if (!strapi.entityService) {
        strapi.log.warn('[Bootstrap] strapi.entityService not available, skipping enterprise data creation');
        return;
      }

      const existingEnterprises = await strapi.entityService.findMany('api::enterprise.enterprise' as any);
      const enterpriseCategories = [
        'Trade & Commerce',
        'Agriculture & Food',
        'Manufacturing',
        'Healthcare & Medicine',
        'Finance & Banking',
        'Education',
        'Arts & Crafts',
        'Technology'
      ];

      if (existingEnterprises.length === 0) {
        for (const category of enterpriseCategories) {
          await strapi.entityService.create('api::enterprise.enterprise' as any, {
            data: {
              title: category,
              slug: category.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-'),
              description: `Women's contributions and innovations in ${category.toLowerCase()}.`,
              category: category,
              featured: true,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info('[Bootstrap] Created sample enterprise entries');
      } else {
        strapi.log.info('[Bootstrap] Enterprise entries already exist');
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error creating enterprise entries:', err);
    }

    // ── Create sample glossary entries if they don't exist ──
    try {
      const existingGlossary = await strapi.entityService.findMany('api::glossary.glossary' as any);

      if (existingGlossary.length === 0) {
        const glossaryTerms = [
          { term: 'Matriarchy', definition: 'A social system where women hold primary power and authority.', category: 'Social' },
          { term: 'Suffrage', definition: 'The right to vote in political elections.', category: 'Political' },
          { term: 'Feminism', definition: 'Advocacy for women\'s rights on the basis of equality of the sexes.', category: 'Social' },
          { term: 'Patriarchy', definition: 'A social system where men hold primary power and authority.', category: 'Social' },
          { term: 'Intersectionality', definition: 'The overlapping of social identities that contribute to discrimination.', category: 'Social' },
          { term: 'Empowerment', definition: 'The process of becoming stronger and more confident.', category: 'Social' }
        ];

        for (const term of glossaryTerms) {
          await strapi.entityService.create('api::glossary.glossary' as any, {
            data: {
              term: term.term,
              definition: term.definition,
              category: term.category,
              featured: true,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info('[Bootstrap] Created sample glossary entries');
      } else {
        strapi.log.info('[Bootstrap] Glossary entries already exist');
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error creating glossary entries:', err);
    }

    // ── Create sample reading list entries if they don't exist ──
    try {
      const existingReadingLists = await strapi.entityService.findMany('api::reading-list.reading-list' as any);

      if (existingReadingLists.length === 0) {
        const readingLists = [
          {
            title: 'African Women Leaders',
            theme: 'Leadership',
            region: 'Africa',
            books: [
              { title: 'Warrior Women of Africa', author: 'Mariama Bâ' },
              { title: 'The Strength of Our Mothers', author: 'Niara Sudarkasa' },
              { title: 'African Women in Revolution', author: 'Wunyabari O. Maloba' }
            ]
          },
          {
            title: 'Medieval European Queens',
            theme: 'Politics',
            region: 'Europe',
            era: 'Pre-colonial',
            books: [
              { title: 'Queens of the Conquest', author: 'Alison Weir' },
              { title: 'Eleanor of Aquitaine', author: 'Marion Meade' },
              { title: 'The She-Wolves', author: 'Helen Castor' }
            ]
          }
        ];

        for (const list of readingLists) {
          await strapi.entityService.create('api::reading-list.reading-list' as any, {
            data: {
              title: list.title,
              slug: list.title.toLowerCase().replace(/\s+/g, '-'),
              description: `Curated reading list on ${list.theme}.`,
              theme: list.theme,
              region: list.region,
              era: list.era,
              books: list.books,
              featured: true,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info('[Bootstrap] Created sample reading list entries');
      } else {
        strapi.log.info('[Bootstrap] Reading list entries already exist');
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error creating reading list entries:', err);
    }

    // ── Create sample teaching resource entries if they don't exist ──
    try {
      const existingTeachingResources = await strapi.entityService.findMany('api::teaching-resource.teaching-resource' as any);

      if (existingTeachingResources.length === 0) {
        const teachingResources = [
          {
            title: "Educator's Guide",
            description: "Comprehensive guide for educators teaching about women's history and contributions.",
            type: "document",
            downloadText: "Download"
          },
          {
            title: "Timeline Poster",
            description: "Visual timeline poster showing key milestones in women's history.",
            type: "document",
            downloadText: "Download"
          },
          {
            title: "Research Guide",
            description: "Guide for conducting research on women's history and contributions.",
            type: "document",
            downloadText: "Download"
          },
          {
            title: "Glossary Quick Reference",
            description: "Quick reference guide to key terms and concepts in women's history.",
            type: "document",
            downloadText: "Download"
          }
        ];

        for (const resource of teachingResources) {
          await strapi.entityService.create('api::teaching-resource.teaching-resource' as any, {
            data: {
              title: resource.title,
              slug: resource.title.toLowerCase().replace(/['\s]+/g, '-').replace(/[^a-z0-9-]/g, ''),
              description: resource.description,
              type: resource.type,
              downloadText: resource.downloadText,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info('[Bootstrap] Created sample teaching resource entries');
      } else {
        strapi.log.info('[Bootstrap] Teaching resource entries already exist');
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error creating teaching resource entries:', err);
    }

    // ── Create sample education module entries if they don't exist ──
    try {
      const existingEducationModules = await strapi.entityService.findMany('api::education-module.education-module' as any);

      if (existingEducationModules.length === 0) {
        const educationModules = [
          {
            title: "Introduction to Women's History",
            description: "An introductory module exploring the foundations of women's history and key figures who shaped societal change.",
            order: 1,
            featured: true
          },
          {
            title: "Women in Science and Technology",
            description: "Discover groundbreaking women who revolutionized science, medicine, and technology throughout history.",
            order: 2,
            featured: true
          },
          {
            title: "Artistic Contributions of Women",
            description: "Explore how women artists, writers, and creators have influenced cultural movements and artistic expression.",
            order: 3,
            featured: true
          },
          {
            title: "Women in Leadership and Politics",
            description: "Learn about women who broke barriers in politics, governance, and social leadership roles.",
            order: 4,
            featured: true
          }
        ];

        for (const module of educationModules) {
          await strapi.entityService.create('api::education-module.education-module' as any, {
            data: {
              title: module.title,
              slug: module.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              description: module.description,
              order: module.order,
              featured: module.featured,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info('[Bootstrap] Created sample education module entries');
      } else {
        strapi.log.info('[Bootstrap] Education module entries already exist');
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error creating education module entries:', err);
    }

    // Routes are now auto-registered via createCoreRouter() in each api/*/routes/*.js file
    strapi.log.info('[Bootstrap] Routes will be auto-registered by Strapi v5 core routers');

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