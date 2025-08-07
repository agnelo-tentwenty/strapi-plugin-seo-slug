import '@strapi/types';

type Services = {
  [key: string]: any;
};

const getService = <TName extends keyof Services>(name: TName, strapi): ReturnType<Services[TName]> => {
  return strapi.plugin('content-manager').service(name as string);
};

export { getService };
