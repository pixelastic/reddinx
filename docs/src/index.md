---
title: reddinx
---

<div class="lead">
  <code>reddinx</code> is a reddit indexer. It saves on disk all posts of
  a specific subreddit, in a format compatible with Algolia records.
</div>

## Usage

```javascript
const reddinx = require('reddinx');

// Launch an initial import of all posts since the subreddit creation
await reddinx.initial(subredditName)

// Then, periodically (for example once every day), update the data with
await reddinx.incremental(subredditName)
```

## What it does

It will get all posts metadata of the specified subreddit and save them on disk
in the `./data` folder. You don't need any API key, as both those API are free
to use.

Depending on the size of the subreddit, this can take up to several hours for an
initial import and should be much faster on any subsequent incremental import.

## How it works

The reddit API only allows access to the most recent posts, so to get all posts
from the subreddit creation (which can be years old), we rely on a third
party API: pushshift.io.

Pushshift provides an API to query all reddit posts, even very old ones. But its
data is not fresh; it's a snapshot of what the post looked like at the time
pushshift indexed it.

So once we got the list of all posts from pushshift, we query the reddit API to
get the latest content, and save it on disk.

