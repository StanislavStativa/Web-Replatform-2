type EnvVariables = {
  readonly ENV: 'production' | 'staging' | 'development' | 'test';
  readonly NODE_ENV: 'production' | 'development';
  readonly NEXT_PUBLIC_ORDERCLOUD_CLIENT_ID: string;
  readonly NEXT_PUBLIC_ORDERCLOUD_API_ENDPOINT: string;
  readonly NEXT_PUBLIC_ORDERCLOUD_CATALOG_ID: string;
  readonly BLOG_PAGES_SSG_LIMIT: number;
  readonly AUTH_SECRET: string;
  readonly SITECORE_API_HOST: string;
  readonly SITECORE_API_KEY: string;
};

export function getEnv(name: keyof EnvVariables): EnvVariables[keyof EnvVariables] {
  const val = process?.env?.[name];

  return val as EnvVariables[keyof EnvVariables];
}
