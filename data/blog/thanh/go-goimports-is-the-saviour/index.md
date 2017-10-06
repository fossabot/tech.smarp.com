---
title: 'Go: Goimports is the saviour'
createdDate: '2015-06-29'
updatedDate: '2017-10-06'
author: thanh
tags:
  - go
  - golang
  - goimports
  - tools
image: placeholder.jpeg
draft: false
---

Go is a great language. Since we moved from NodeJS to Go, I don’t have any regret at all. Except the fact that it gets me to my nerve every time the Go compilers throws a list of import errors. Don’t get me wrong, I totally understand the goodwill of the Go team on this. However, a helper tool would be very much appreciated.

It took me well a few months before I found out a great tool, call [`goimports` by Brad Fitzpatrick](https://github.com/bradfitz/goimports), kudos to him. I’m using Sublime Text 3 with [GoSublime](https://github.com/DisposaBoy/GoSublime).

As usual with other go package, you can install goimports with go get. `$ go get golang.org/x/tools/cmd/goimports`

Open GoSublime Package Setting and search for `fmt_cmd`. If you haven’t used any go format tool, it’s currently an empty array. Go ahead and add `goimports` to the array. You will have something like this: `"fmt_cmd": ["goimports"]`

Now write some simple Go code without any import statement, save it and see the magic!

Some extra tips:

1.  You can even use goimports with Go Playground as well. All you need to do is tick the “Imports” option and click “Format”.
2.  When editing the GoSublime settings, you should not make any changes to the default setting. All your changes will be lost when you update GoSublime. Instead, copy the whole settings to Settings – User then edit them there.
