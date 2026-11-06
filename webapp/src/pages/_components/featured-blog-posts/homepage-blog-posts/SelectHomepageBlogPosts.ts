interface BlogPostHomepageData {
  homepageOrder?: number;
}

interface BlogPostWithHomepageData {
  data: BlogPostHomepageData;
}

export const HOMEPAGE_BLOG_POST_LIMIT = 2;

export function selectHomepageBlogPosts<T extends BlogPostWithHomepageData>(posts: readonly T[]): T[] {
  return posts
    .filter(post => post.data.homepageOrder !== undefined)
    .sort((first, second) => order(first) - order(second))
    .slice(0, HOMEPAGE_BLOG_POST_LIMIT);
}

function order(post: BlogPostWithHomepageData): number {
  return post.data.homepageOrder ?? Number.MAX_SAFE_INTEGER;
}
