---
title: Hooks
---

If the default metadata provided by `reddinx` is not enough for you and you need
to further normalize it before saving to disk, you can define your own `onEach`
hook.

By default, the hook is a no-op (does nothing), but you can define your own
method that will receive the post metadata as input and expect your modified
version as output. What the method returns will be saved to disk. If the method
returns `null`, nothing will be saved on disk.

Note that `onEach` is called on each record right before saving it to disk
(either during an initial or incremental import), but thus will not be called on
old posts that are outside of the [incrementalWindow](/options).

