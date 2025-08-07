import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import SlugFieldIcon from './components/SlugFieldIcon';
import { getTranslation } from './utils/getTranslation';
import * as yup from "yup";

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: 'slug',
      pluginId: `${PLUGIN_ID}`,
      type: 'uid',
      intlLabel: {
        id: getTranslation('slug.label'),
        defaultMessage: 'SEO Slug',
      },
      intlDescription: {
        id: getTranslation('slug.description'),
        defaultMessage: 'Unique SEO friendly Slug',
      },
      components: {
        Input: async () =>
          import('./components/Input').then((m) => ({
            // @ts-ignore
            default: m.Input,
          })),
      },
      icon: SlugFieldIcon,
      options: {
        base: [
          {
            intlLabel: {
              id: getTranslation("slug.attached-field.label"),
              defaultMessage: 'Attached field',
            },
            description: {
              id: getTranslation("slug.attached-field.description"),
              defaultMessage: "Select the field on which slug will be generated",
            },
            name: `options.attachedField`,
            type: 'text'
          },
        ],
        advanced: [
          {
            intlLabel: {
              id: getTranslation('slug.strip-stopwords.label'),
              defaultMessage: 'Strip stopwords',
            },
            description: {
              id: getTranslation('slug.strip-stopwords.description'),
              defaultMessage: 'Remove stopwords',
            },
            name: `options.stripStopwords`,
            type: 'checkbox',
          },
          {
            intlLabel: {
              id: getTranslation('slug.max-length.label'),
              defaultMessage: 'Max slug length',
            },
            description: {
              id: getTranslation('slug.max-length.description'),
              defaultMessage: 'Maximum length of the slug',
            },
            name: `options.maxLength`,
            type: 'number',
          }
        ],
        validator: (args: any) => ({
          attachedField: yup
            .string()
            .oneOf(['', ...args?.[0]], {
              id: 'options.attachedField.invalid',
              defaultMessage: `Attached field must be a valid field. Available fields ${args?.[0].join(', ')}`,
            }),
        })
      },

    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
