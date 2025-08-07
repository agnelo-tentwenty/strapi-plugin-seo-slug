import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../admin/src/pluginId';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
   strapi.customFields.register({  
    name: "slug",  
    plugin: `${PLUGIN_ID}`,
    type: "uid",
  });  
};

export default register;
