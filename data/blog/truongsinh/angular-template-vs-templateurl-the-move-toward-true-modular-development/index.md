---
title: 'Angular: template vs templateUrl; the move toward true modular development'
createdDate: '2017-04-18'
updatedDate: '2017-10-06'
author: truongsinh
tags:
  - starter
  - gatsby
image: pexels-photo-253092.jpeg
draft: false
---

TL;DR: use dependency management system and `template` to organize your Angular project; it will help you to migrate to Angular 2 too!

## Breaking it apart…

At Smarp, we use Angular to develop our frontend SmarpShare. One of the FAQs when declaring Angular controllers and directives is [`template` vs `templateUrl`](https://www.google.ie/search?client=safari&rls=en&q=template+vs+templateurl&ie=UTF-8&oe=UTF-8&gws_rd=cr&ei=anpxVZLVLMyV7Abe4YOoDg). On the [official Angular page](https://docs.angularjs.org/guide/directive), it is said that

> **Best Practice**: Unless your template is very small, it’s typically better to break it apart into its own HTML file and load it with the `templateUrl` option.

First of all, I agree that unless the template is very small (that it fits in one line) and/or you are doing 100-LOC pet project, it’s typically better to break it apart. Breaking it apart, however, doesn’t necessarily mean using `templateUrl`. The mechanism behind `templateUrl` is that it is loaded by Angular with XHR; yet, in production, you might want to use [RequireJS](http://requirejs.org/)/[AmdClean](https://github.com/gfranko/amdclean)/[Browserify](http://browserify.org/)/[WebPack](https://webpack.github.io/) to bundle your assets (js, css, html, png, etc.) When we were following “best practice”, we were using `templateUrl` and [gulp-ng-templates](https://www.npmjs.com/package/gulp-ng-templates)

> Basically, gulp-ng-templates just put **each \*.html file** into angular.$templateCache

Sight, I mean **all \*.html file**. Although SmarpShare use SPA approach, we have more than one entry-points, and even in the main entry-point, we have one bundle for normal users, and another for admin users. We would like to include only relevant **\*.html file** in each bundle. How did our nerds solve this problem then?

## … and getting it back

There are 2 requirements:

-   dependency management system ([AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition), [CommonJS require](http://wiki.commonjs.org/wiki/Modules/1.1), or [ES6 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) syntax). In this post, I will use ES6 syntax
-   novicely basic HTML to JS transformer

Here’s the part using `templateUrl`: 

```html
<!-- ./path/to/my.html -->
<div>
 "SmarpShare"
 <span>is<span>
 awesome, dud'
</div>
```

```ts
// ./path/my-component-name.ts
angular
.module("myComponentName")
.directive("myComponentName", function() {
  return
  {
   restrict: 'E',
   templateUrl: './path/to/my.html',
   controller: myComponentNameCtrl,
   controllerAs: "vm",
  });
```

Ok, so we just move `./path/to/my.html` to `./path/my-component-name.html`, and change `./path/my-component-name.ts` to:

```ts
// ./path/my-component-name.ts
import tpl from './my-component-name.html';
angular
.module("myComponentName")
.directive("myComponentName", function() {
  return
  {
   restrict: 'E',
   template: tpl,
   controller: myComponentNameCtrl,
   controllerAs: "vm",
  });
```

As you can see, in line #2, I import the HTML template as a JS string, to use it in line #9… except, the compiler complains `Cannot find my-component-name.html.ts`. Of course, because you missed 2nd requirement. Here’s how to fulfill it:

```js
gulp.task('ng-template-watch', function () {
  gulp
    .src('path/**/*.html')
    .pipe(through2.obj(function(file, _, cb){
      file.path += ".ts";
      var prefix = 'var t =';
      var suffix = ';\nexport default t;\n';
      var newC = prefix + JSON.stringify(file.contents.toString()) + suffix;
      file.contents = new Buffer(newC);
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest('path/'))
    ;
});
```

In line #3, we get every HTML to pre-process (don’t worry, we just pre-process it, we don’t include everything in the built bundle). In line #5, we make sure the generated file name will be, for example, `my.html.ts`. In line #13, we put generated files to the same directory as original files’. And here’s the original and generated file:

```html
<!-- ./path/my-component-name.html -->
<div>
 "SmarpShare"
 <span>is<span>
 awesome, dud'
</div>
```

```ts
// ./path/my-component-name.html.ts
var t ="<div>\n  \"SmarpShare\"\n <span>is</span>\n awesome, dud'\n</div>\n";
export default t;
```

Voila, it works. So, from now on, it should be considered best practice to split the `template` in to its own JS string (possibly preprocessed from HTML file). This approach will also help you a lot when migrating to Angular 2.
