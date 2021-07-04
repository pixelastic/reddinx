---
title: Scheduled jobs
---

<div class="lead">
  Tips and advice on how to keep your data automatically updated.
</div>

To keep your data up to date with your subreddit, it is expected that you run
`reddinx.incremental()` on a regular basis. Because manually running the command
and committing the results is not sustainable, you should find a way to run it
automatically for you.

As an example, here is how I configured it to automatically update the content
of
[https://gamemaster.pixelastic.com/maps/][1]
with new posts from [/dndmaps][2].

First, I [configured CircleCI][3] to run the `yarn run ci:dailyUpdate` script
every day. [This script][4] then runs an incremental update, commit the changes,
push them back to the repository and updates my Algolia search index.

If you're looking for an easy way to run sandboxed scripts on CircleCI, check
[on-circle][5].

[1]: https://gamemaster.pixelastic.com/maps/
[2]: https://www.reddit.com/r/dndmaps/
[3]: https://github.com/pixelastic/maps/blob/master/.circleci/config.yml
[4]: https://github.com/pixelastic/maps/blob/master/scripts/ci-dailyUpdate.js
[5]: https://projects.pixelastic.com/on-circle/
