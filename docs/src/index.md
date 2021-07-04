---
title: reddinx
---

<div class="lead">
  <code>reddinx</code> is a reddit indexer. It saves on disk all posts of
  a specific subreddit, in a format compatible with Algolia records.
</div>

## How it works

The reddit API only allows access to the most recent posts, so to get all posts
from the subreddit creation (which can be years old), we rely on a third
party API: pushshift.io.

Pushshift provides an API to query all reddit posts, even very old ones. But its
data is not fresh; it's a snapshot of what the post looked like at the time
pushshift indexed it.

So once we got the list of all posts from pushshift, we query the reddit API to
get the latest content, and save it on disk.

