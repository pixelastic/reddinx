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
  "flair": ["Region"],
  "id": "t3_mf0xo2",
  "picture": {
    "filesize": 127885,
    "fullUrl": "https://preview.redd.it/fu4azxhfnrp61.jpg?auto=webp&s=b8c020cd53528216e081ba52170f009101706862",
    "hash": "8370fe7de1",
    "height": 640,
    "lqip": "data:image/jpg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQG/8QAJBAAAgIBBAIBBQAAAAAAAAAAAQIDBBEABSExEyIGEkFRYXH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAERIf/aAAwDAQACEQMRAD8A11cyKz2LzhrUzMqWzKPHHyAx56OMjrJ6HeglgjimieFUr2gxBhkmz9ffuoYEoMc4OCPxodve/tnyOtUqh565bxuRaEgnJHscY/h/WNSb7a26lu81S3vMTAAq5SXkA9k5yC2Dzz9tNrKCn//Z",
    "url": "https://preview.redd.it/fu4azxhfnrp61.jpg?width=640&crop=smart&auto=webp&s=b48bc9ccfbb7ba5b4f481f77c273f5513c620d9d",
    "width": 640
  },
  "score": {
    "comments": 3,
    "downs": 0,
    "ratio": 1,
    "ups": 211,
    "value": 211
  },
  "subreddit": {
    "id": "t5_3isai",
    "name": "dndmaps"
  },
  "tags": ["OC"],
  "title": "The refuge of the lost tooth. Last inn before the wild lands.",
  "url": "https://www.reddit.com/r/dndmaps/comments/mf0xo2/the_refuge_of_the_lost_tooth_last_inn_before_the/"
}
```

This file will be saved in `./data/dndmaps/2021/03/t2_3prumcf9.json`. All keys
are alphabetically sorted to make diffing the file easier to read.

Posts without pictures, or with their picture deleted or too heavy will not be
saved.

## Keys

| Key         | Subkey          | Description                                                      |
| ----------- | --------------- | ---------------------------------------------------------------- |
| `author`    |                 | Author metadata                                                  |
|             | `.id`           | Author Reddit ID. Always starts with `t2_`                       |
|             | `.name`         | Author name as displayed                                         |
| `date`      |                 | Date metadata                                                    |
|             | `.full`         | Post creation date, as Unix timestamp                            |
|             | `.day`          | ...clamped to the start of the day                               |
|             | `.week`         | ...clamped to the start of the week                              |
|             | `.month`        | ...clamped to the start of the month                             |
| `flair`     |                 | Array of flair added to the post                                            |
| `id`        |                 | Post reddit ID. Always starts with `t3_`                         |
| `picture`   |                 | Picture metadata                                                 |
|             | `.filesize`     | Size in bytes of the picture                                     |
|             | `.fullUrl`      | URL to the post original image                                   |
|             | `.hash`         | Unique hash representing the file                                |
|             | `.height`       | Height, in pixels                                                |
|             | `.lqip`         | Base64 encoded representation of a Low Quality Image Placeholder |
|             | `.url`          | URL to the post preview image (visible in the subreddit index)   |
|             | `.width`        | Width, in pixels                                                 |
| `score`     |                 | Various scoring metadata                                         |
|             | `.comments`     | Number of comments                                               |
|             | `.ups`          | Number of upvotes                                                |
|             | `.downs`        | Number of upvotes                                                |
|             | `.ratio`        | Ratio of up/down votes                                           |
|             | `.value`        | Score value attributed by reddit                                 |
| `subreddit` |                 | Subreddit metadata                                               |
|             | `.id`           | Subreddit ID. Always starts with `t5_`                           |
|             | `.name`         | Subreddit name (as visible in the URL)                           |
| `tags`      |                 | Array of tags (anything between `[]` in the title)                                            |
| `title`     |                 | Name of the post                                                 |
| `url`       |                 | Permalink to the post                                            |

[1]: https://www.reddit.com/r/dndmaps/comments/mf0xo2/the_refuge_of_the_lost_tooth_last_inn_before_the/
