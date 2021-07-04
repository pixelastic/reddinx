---
title: Data format
---

All posts saved by `reddinx` follow the same pattern. Below is what [this
post][1]
would look like once imported through `reddinx`.

```json
{
  "author": {
    "id": "t2_3prumcf9",
    "name": "Persevrant"
  },
  "date": {
    "day": 1616889600,
    "full": 1616936116,
    "month": 1614556800,
    "week": 1616889600
  },
  "id": "t3_mf0xo2",
  "misc": {
    "postHint": "image"
  },
  "picture": {
    "full": "https://preview.redd.it/fu4azxhfnrp61.jpg?auto=webp&s=b8c020cd53528216e081ba52170f009101706862",
    "preview": "https://preview.redd.it/fu4azxhfnrp61.jpg?width=640&crop=smart&auto=webp&s=b48bc9ccfbb7ba5b4f481f77c273f5513c620d9d",
    "thumbnail": "https://b.thumbs.redditmedia.com/4T82LxOj2KjJplPFaTrDQbiPQH7kkpns0yc0qL88bGk.jpg"
  },
  "score": {
    "comments": 3,
    "downs": 0,
    "isCurated": false,
    "ratio": 1,
    "ups": 211,
    "value": 211
  },
  "subreddit": {
    "id": "t5_3isai",
    "name": "dndmaps"
  },
  "tags": ["Region"],
  "title": "The refuge of the lost tooth. Last inn before the wild lands.",
  "url": "https://www.reddit.com/r/dndmaps/comments/mf0xo2/the_refuge_of_the_lost_tooth_last_inn_before_the/"
}
```

This file will be saved in `./data/dndmaps/2021/03/t2_3prumcf9.json`. All keys
are alphabetically sorted to make diffing the file easier to read.

## Keys

| Key         | Subkey       | Description                                                    |
| ----------- | ------------ | -------------------------------------------------------------- |
| `author`    |              | Author metadata                                                |
|             | `.id`        | Author Reddit ID. Always starts with `t2_`                     |
|             | `.name`      | Author name as displayed                                       |
| `date`      |              | Date metadata                                                  |
|             | `.full`      | Post creation date, as Unix timestamp                          |
|             | `.day`       | ...clamped to the start of the day                             |
|             | `.week`      | ...clamped to the start of the week                            |
|             | `.month`     | ...clamped to the start of the month                           |
| `id`        |              | Post reddit ID. Always starts with `t3_`                       |
| `misc`      |              | Uncategorized metadata                                         |
|             | `.postHint`  | How reddit sees this post                                      |
| `picture`   |              | Picture metadata                                               |
|             | `.full`      | URL to the post original image                                 |
|             | `.preview`   | URL to the post preview image (visible in the subreddit index) |
|             | `.thumbnail` | URL to the post thumbnail image (visible in search results)    |
| `score`     |              | Various scoring metadata                                       |
|             | `.comments`  | Number of comments                                             |
|             | `.ups`       | Number of upvotes                                              |
|             | `.downs`     | Number of upvotes                                              |
|             | `.ratio`     | Ratio of up/down votes                                         |
|             | `.value`     | Score value attributed by reddit                               |
| `subreddit` |              | Subreddit metadata                                             |
|             | `.id`        | Subreddit ID. Always starts with `t5_`                         |
|             | `.name`      | Subreddit name (as visible in the URL)                         |
| `tags`      |              | Array of tags (flair)                                          |
| `title`     |              | Name of the post                                               |
| `url`       |              | Permalink to the post                                          |

[1]: https://www.reddit.com/r/dndmaps/comments/mf0xo2/the_refuge_of_the_lost_tooth_last_inn_before_the/
