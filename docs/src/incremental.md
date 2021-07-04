---
title: incremental()
---

<div class="lead">
  Performs an incremental import of all posts since the last import.
</div>

```js
await reddinx.incremental(subredditName[, options])
```

This will update the existing posts in the `./data` folder with all new posts
created since the last import. It will also update existing posts created up to
7 days before the last import.

Ideally, you should run this method on a regular basis, maybe even every day
through a cron job to be sure to grab all new posts and keep your data fresh.

Due to the nature of reddit posting, recent posts are updated very frequently
(new comments and upvotes) in the 24-48h after they are posted. Then, the oldest
they become, the less frequently they get updated.

You can change the `incrementalWindow` [option](/options) to change the 7 days default
period. The rule of thumb is as follow:

- If you have a very active subreddit where posts are very rapidly moved to the
  second or third page, you can lower the `incrementalWindow`.
- If you have a not-so-active subreddit where new posts are rare but people
  interact with the existing posts a lot, you should increase the
  `incrementalWindow`
