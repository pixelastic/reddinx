---
title: options
---

Both the `initial` and `incremental` methods accept an `options` parameters.

This argument is completely optional and if you don't provide one, sane defaults
will be used. If you want to alter the behavior, here are the options you can
change.

| name              | description                                                   | default value |
| ----------------- | ------------------------------------------------------------- | ------------- |
| dataPath          | Directory where the final records are saved                   | `./data`      |
| cachePath         | Directory where the HTTP requests are cached                  | `./.cache`    |
| onEach            | Method called on each record before saving it to disk         | `null`        |
| incrementalWindow | How far back should the incremental import update old records | `[7, 'days']` |

## `dataPath`

By default, all records are saved in the `./data` folder. You can change the
path here if you'd rather have it saved somewhere else.

Note that it won't change the way records are stored in a `YYYY/MM/DD` folder
structure inside the directory.

## `cachePath`

To limit the number of HTTP requests made, `reddinx` caches all of them on disk
in the `./.cache` folder. You can change the location of the cached folder here.

Note that if you ever want to restart an import from scratch, with a clean
state, deleting this directory could be a good idea.

## `onEach`

This hook is called on each record, right before saving it to disk. This is your
chance to alter the data for your specific use-case right before it is saved on
disk.

It takes the record as input, and expect a record as output.

## `incrementalWindow`

When doing an [incremental import](/incremental), `reddinx` will update posts in
the past up to this value. The more you increase it, the most up-to-date data
you will have, but it's useless to try to go to far back in time as if posts are
too old, they are rarely updated and your data is already good enough.
