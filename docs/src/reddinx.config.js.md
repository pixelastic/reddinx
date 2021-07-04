---
title: reddinx.config.js
---

`reddinx` uses a `reddinx.config.js` config file to save part of its internal
state. This file is what allows `reddinx` to run incremental imports, because it
knows when was the last time it did an import.

The only information stored in the file is the `lastCrawledDate`, and you should
never have to edit this file manuallye

