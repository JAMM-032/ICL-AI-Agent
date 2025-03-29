/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_debug`; params?: Router.UnknownInputParams; } | { pathname: `/_story`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/legal/privacy`; params?: Router.UnknownInputParams; } | { pathname: `/settings/icon`; params?: Router.UnknownInputParams; } | { pathname: `/movie/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/movie/actor/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_debug`; params?: Router.UnknownOutputParams; } | { pathname: `/_story`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/settings`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/legal/privacy`; params?: Router.UnknownOutputParams; } | { pathname: `/settings/icon`; params?: Router.UnknownOutputParams; } | { pathname: `/movie/[id]`, params: Router.UnknownOutputParams & { id: string; } } | { pathname: `/movie/actor/[id]`, params: Router.UnknownOutputParams & { id: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/_debug${`?${string}` | `#${string}` | ''}` | `/_story${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/settings${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/legal/privacy${`?${string}` | `#${string}` | ''}` | `/settings/icon${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_debug`; params?: Router.UnknownInputParams; } | { pathname: `/_story`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/legal/privacy`; params?: Router.UnknownInputParams; } | { pathname: `/settings/icon`; params?: Router.UnknownInputParams; } | `/movie/${Router.SingleRoutePart<T>}` | `/movie/actor/${Router.SingleRoutePart<T>}` | { pathname: `/movie/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/movie/actor/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
    }
  }
}
