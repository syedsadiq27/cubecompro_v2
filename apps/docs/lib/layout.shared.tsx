import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <span className="font-semibold">CubeCom Pro</span>
          <span className="text-fd-muted-foreground font-normal"> Docs</span>
        </>
      ),
      url: '/',
    },
    links: [
      {
        text: 'Product authoring',
        url: '/use',
        active: 'nested-url',
      },
      {
        text: 'Build',
        url: '/build',
        active: 'nested-url',
      },
      {
        text: 'GraphQL',
        url: '/api/graphql',
        active: 'nested-url',
      },
      {
        text: 'REST',
        url: '/api/rest',
        active: 'nested-url',
      },
    ],
  };
}
