import type { CardListData } from 'astro-pure/types'

// Docs content declaration
export const docs: CardListData = {
  title: 'Docs content',
  list: [
    {
      title: 'Setup',
      children: [
        { title: 'Getting Started', link: '/docs/setup/getting-started' },
        { title: 'Configuration', link: '/docs/setup/configuration' },
        { title: 'Authoring Content', link: '/docs/setup/content' },
        { title: 'Deployment', link: '/docs/setup/deployment' }
      ]
    },
    {
      title: 'Integrations',
      children: [
        { title: 'Comment System', link: '/docs/integrations/comment' },
        { title: 'Friend Links', link: '/docs/integrations/links' },
        { title: 'Shiki Code', link: '/docs/integrations/code' },
        { title: 'User Components', link: '/docs/integrations/components' },
        { title: 'Advanced Components', link: '/docs/integrations/advanced' },
        { title: 'Other Integrations', link: '/docs/integrations/others' }
      ]
    },
    {
      title: 'Advanced',
      children: [
        { title: 'Update Theme', link: '/docs/advanced/update' },
        { title: 'Optimize Your Site', link: '/docs/advanced/optimize' },
        { title: 'Acknowledgements', link: '/docs/advanced/thanks' }
      ]
    }
  ]
}
