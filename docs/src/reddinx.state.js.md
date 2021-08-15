---
title: reddinx.state.js
---

`reddinx` uses a `reddinx.state.js` file to save part of its internal
state. This file is what allows `reddinx` to run incremental imports, because it
knows when was the last time it did an import.

It will be created on first run, and updated on subsequent runs.

The only information stored in the file is the `lastCrawledDate` for each
subreddit, and you should never have to edit this file manually.
