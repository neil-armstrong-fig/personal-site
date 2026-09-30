# neilarmstrong.dev

Source for [neilarmstrong.dev](https://neilarmstrong.dev), the personal website of Neil Armstrong, a software
architect and developer in Belfast. It contains software case studies, open-source projects, and long-distance
cycling stories.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

Trip videos are not in this repository. They are uploaded to a Cloudflare R2 bucket (S3-compatible storage) and
served from `media.neilarmstrong.dev`. `pnpm dev` plays clips from a local, gitignored `public/trips/` folder, while
`pnpm build` checks that every clip exists on the media origin.

Code is [MIT](LICENSE). The writing and photography are not covered by that licence; see
[CONTENT-LICENSE.md](CONTENT-LICENSE.md).
