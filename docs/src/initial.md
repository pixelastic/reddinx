---
title: initial()
---

<div class="lead">
  Performs an initial import of all posts of a specific subreddit, since its
  creation up until today.
</div>


```js
await reddinx.initial(subredditName[, options])
```

This will save all posts from the `dndmaps` subreddit in the `./data` folder.
A subdirectory will be created for each year since the subreddit creation, down
to the month and day. Then, a `.json` file will be saved for each post (the name
of the `.json` file is the Reddit uuid of the post).

Depending on the popularity and age of the subreddit, this can take from several
minutes to several hours.

This will update your `reddinx.config.js` with the date of the last import, so
you'll then be able to run `incremental` and only update your data with the new
posts since your last import.
