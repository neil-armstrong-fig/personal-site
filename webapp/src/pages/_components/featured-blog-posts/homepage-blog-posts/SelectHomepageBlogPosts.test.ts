import {expect, it} from "vitest";

import {selectHomepageBlogPosts} from "./SelectHomepageBlogPosts";

it("selects homepage blog posts in their explicit order without changing the input", () => {
  const posts = [
    {id: "unfeatured", data: {}},
    {id: "third", data: {homepageOrder: 3}},
    {id: "second", data: {homepageOrder: 2}},
    {id: "first", data: {homepageOrder: 1}},
  ];

  expect(selectHomepageBlogPosts(posts).map(post => post.id)).toEqual(["first", "second"]);
  expect(posts.map(post => post.id)).toEqual(["unfeatured", "third", "second", "first"]);
});

it("shows at most two homepage blog posts, keeping the lowest orders", () => {
  const posts = [
    {id: "fourth", data: {homepageOrder: 4}},
    {id: "second", data: {homepageOrder: 2}},
    {id: "first", data: {homepageOrder: 1}},
    {id: "third", data: {homepageOrder: 3}},
  ];

  expect(selectHomepageBlogPosts(posts).map(post => post.id)).toEqual(["first", "second"]);
});

it("selects nothing when no post has a homepage order", () => {
  expect(selectHomepageBlogPosts([{id: "only", data: {}}])).toEqual([]);
});
