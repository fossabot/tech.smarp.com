---
title: New AngularJS with IE8
createdDate: '2015-06-15'
updatedDate: '2017-10-07'
author: minh
tags:
  - ie8
  - internet explorer
  - javascript
  - angular
  - angularjs
  - frontend
image: ilya-pavlov-87438.jpg
draft: false
---

We all know that [Google has dropped support for Internet Explorer 8](https://docs.angularjs.org/guide/ie) (IE8) since their update in AngularJS 1.3. However, at Smarp, we still have a part of subscribers who (are painfully forced to) use IE8 as their main browser. In this blog, I will show you some tips making IE8 compatible with your application developed with AngularJS 1.3 and newer.

## AngularJS IE8 Custom builds to the rescue!

[Angular.js-ie8-builds](https://github.com/fergaldoyle/angular.js-ie8-builds) will provide support for IE8 in our application. Making sure you already have [ee5-shim](https://github.com/es-shims/es5-shim) and [jquery](http://jquery.com/download/), installing the builds takes only one line of command:

[![bower install angularjs-ie8-build](https://web.archive.org/web/20151025231908im_/http://www.smarpshare.com/wp-content/uploads/2015/06/10000000000001280000001CEEFF1761.png)](http://www.smarpshare.com/wp-content/uploads/2015/06/10000000000001280000001CEEFF1761.png)

## The tricky part

Now that you have installed the package, our next step is to replace our normal angular package with this one. You will notice that all the `.js` files of this package are stored within a folder called `dist`.

[![angularjs-ie8-files](https://web.archive.org/web/20151025231908im_/http://www.smarpshare.com/wp-content/uploads/2015/06/10000000000000C6000000778E5F93CA.png)](http://www.smarpshare.com/wp-content/uploads/2015/06/10000000000000C6000000778E5F93CA.png)

Take a look at our `<script>` address where we use normal AngularJS:

![official angular](https://web.archive.org/web/20151025231908im_/http://www.smarpshare.com/wp-content/uploads/2015/06/1000000000000186000000101B57549A-300x12.png)

If you project has grown so big that you use a lot of `<script>` addresses like this one, the `dist` category could be a problem if you have to change the path one by one.

The tip here is to use [local folder](http://bower.io/docs/api/#install "bower install local folder") point the path of normal angular to the `dist` folder by a small change in `bower.json` file and update bower.

[![relative path](https://web.archive.org/web/20151025231908im_/http://www.smarpshare.com/wp-content/uploads/2015/06/1000000000000086000000117744C784.png)](http://www.smarpshare.com/wp-content/uploads/2015/06/1000000000000086000000117744C784.png)

→ “angular”: “./components/angularjs-ie8-build/dist”

Voilà, now your original angular has pointed to IE 8 custom builds and your application should recognize the IE8 package.

_**Update:** angularjs-ie8-build now [supports 1.4](https://github.com/fergaldoyle/angular.js-ie8-builds/commit/2f482fc3c95764a84d3b624d6faac66a8622e917 "Angular 1.4")_
