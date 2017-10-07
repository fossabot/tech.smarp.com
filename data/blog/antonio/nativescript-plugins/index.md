---
title: NativeScript Plugins
createdDate: '2015-10-23'
updatedDate: '2017-10-07'
author: antonio
tags:
  - cocoapods
  - gradle
  - mobile
  - nativescript
image: rodion-kutsaev-184298.jpg
draft: false
---

Some  month ago I started as a mobile programmer at [Smarp](http://www.smarpshare.com/who-we-are/). With this new job I got to start working with a new and promising cross platform framework, [NativeScript](https://www.nativescript.org/). As time went by (and crash after crash) I started to understand how to use some advanced functionalities of the framework.

The plugins come to fill the missing gaps in the framework and in this post I will go through the process of creating one step by step. Recently I created a plugin that abstract the the Facebook Sdk for login, and I will use it as an example.

## First, the structure

Time to create folders and files, or clone and rename. In the official [documentation](https://docs.nativescript.org/plugins) there is a lot of examples of structures that your plugin can implement. In this case the structure looks like this.

    ─ nativescript-facebook-login 
        ├──platforms
        │  ├──android
        │  │  └─libs
        │  │    └─facebook.aar <-- The android library
        │  └──ios
        │     └─Podfile <-- The iOS library as a cocoapods dependency 
        ├──facebook-handler.android.js
        ├──facebook-handler.ios.js 
        ├──LICENSE
        ├──README
        └──package.json

As you can see, there is two JavaScript classes that use the suffix .android/.ios and are accessible only to their correspondent platforms. This will help with the task of keeping the plugin as an abstraction of the Java/ObjectiveC code.

## Second, the libraries

For Android we are placing the Java code as an .aar library but .jar are also supported.  If you want to use Gradle dependencies  you can add them to the platforms/android/build.gradle manually after the plugin is installed.  
For iOS there is a Podfile with the dependency and  .framework can be also added creating a libs folder inside ios.

The Podfile is really easy to create, just find the [cocoapod](https://cocoapods.org/) (only Objective C  pods are supported by now) and copy the text to your file.

[![Screen Shot 2015-10-23 at 3.03.33 PM](https://web.archive.org/web/20151025145939im_/http://tech.smarp.com/wp-content/uploads/2015/10/Screen-Shot-2015-10-23-at-3.03.33-PM-300x111.png)](http://tech.smarp.com/wp-content/uploads/2015/10/Screen-Shot-2015-10-23-at-3.03.33-PM.png)

## Third, accessing your libraries

Thispart is tricky as you will have to "translate” Java and ObjectiveC to JavaScript, the best way to learn is by checking how others are doing it in [npm](https://www.npmjs.com/search?q=nativescript)

But here it comes a crash course.

-   Android


    The calls are verbose FacebookSdk translates to com.facebook.FacebookSdk  
    This is your context: applicationModule.android.context.getApplicationContext()  
    This is your activity:  applicationModule.android.foregroundActivity  
    This is a new Intent():  new android.content.Intent();  
    This is @Override: activiy.onSomething=(a,b,c)<span class="pl-k">=></span> {  The new code for the method}  
    You can access java utils like this: java.util.XXX

-   iOS  


    The calls are short: [[FBSDKLoginManager alloc] init] translates to <span class="pl-k">new</span> FBSDKLoginManager();

And this is a method:  
[![Screen Shot 2015-10-23 at 3.47.37 PM](https://web.archive.org/web/20151025145939im_/http://tech.smarp.com/wp-content/uploads/2015/10/Screen-Shot-2015-10-23-at-3.47.37-PM-1024x182.png)](http://tech.smarp.com/wp-content/uploads/2015/10/Screen-Shot-2015-10-23-at-3.47.37-PM.png)

## Fourth, testing your plugin

\*\*Once you have everything ready you can edit the pakage.json to point to your main class and  install your plugin:  
`tns plugin add Path/To/Your/Plugin`

```json
{
  "name": "nativescript-XX",
  "version": "x.x.x",
  "description": "XX",
  "main": "my-main.js",
  "nativescript": {
    "platforms": {
      "android": "1.3.0",
      "ios": "1.3.0"
    }
  }
}
```

## Fifth and last, publishing

`cd to your plugin directory  
npm login  
npm publish`

And that’s it. Five steps that lead to a lot of developers happy because you shared your work with them 😀
