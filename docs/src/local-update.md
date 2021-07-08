---
title: localUpdate()
---

<div class="lead">
  Update all records already on disk by applying <code>onEach</code> on them.
</div>

```js
await reddinx.localUpdate(subredditName[, options])
```

By default, the `onEach` hook is only called on records when saved on disk
(either during an `initial` or `incremental` import). If you want to call it on
old records as well that are outside of the `incrementalWindow`, you should use
`reddinx.localUpdate`.

This will get through the list of all records already saved on disk, apply your
custom `onEach` hook on them and update the result on disk. If `onEach` returns
`false`, the existing record file will be deleted.

