---
title: >-
  Karma + RequireJS: RequireJS fails to append ‘.js’ extension to relative
  paths.
createdDate: '2015-06-20'
updatedDate: '2017-10-06'
author: igor
tags:
  - frontend
image: pexels-photo-59628.jpeg
draft: false
---

_**Update:** Karma version [v0.12.37](https://web.archive.org/web/20151025165045/https://github.com/karma-runner/karma/blob/v0.12.37/CHANGELOG.md) includes this fix. But still this article can be helpful for those who are using old versions of Karma._

There is a great guide on Karma official website about how to make Karma + RequireJS setup. Generated code will work perfectly until you start to reference your scripts with relative paths (like `./path/to/file`). For instance, if you want to require files from the same directory as the spec files. Let’s give a closer look why it occurs and how to fix it.

## What is the problem?

To make it clear, let’s modifycode example that we get from the original guide.

We’ll simply replace `app` with `../src/app`

After making this modification, we’ll start getting following error `'There is no timestamp for /base/src/app!'` on a test run. Although the path to the script is valid, we’re missing `.js` extension. That’s why RequireJS throws an error.

Digging into RequireJS docs [http://requirejs.org/docs/api.html#jsfiles](https://web.archive.org/web/20151025165045/http://requirejs.org/docs/api.html#jsfiles) we can find an interesting information:

> There may be times when you do want to reference a script directly and not conform to the “baseUrl + paths” rules for finding it. If a module ID has one of the following characteristics, the ID will not be passed through the “baseUrl + paths” configuration, and just be treated like a regular URL that is relative to the document:  
> – Ends in “.js”.  
> – Starts with a “/”.  
> – Contains an URL protocol, like “http&#x3A;” or “https&#x3A;”.

So, because Karma serves spec scripts with absolute paths, all generated relative urls become absolute when normalised. That’s why treating of `.js` is dropped by RequireJS.

## How to solve this?

Alright, if RequireJS behave in that way, then we need to normalise paths to spec files before passing them to require config. We will do it in `test/test-main.js` script.

What we want is a modification to spec paths which we get from `window.__karma__.files` array. From this: `'/base/test/appSpec.js'` to this: `'test/appSpec'`

We need also update our `baseUrl: '/base/src'` to `baseUrl: '/base'`, because it will append `'/base/src'` prefix to our paths. But we need just `'/base'` to be attached.

So here is the new working file:  

That’s it! Now we have working solution on board.
