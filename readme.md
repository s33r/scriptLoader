What is This?
================================================================
ScriptLoader is a very small library that loads scripts dynamically. It can load scripts in order or sequentially or a mix of both.

Features
================================================================
* Load scripts in order.
* Load scripts in parallel.
* Provide a fallback in case a script fails to load.
* Run a callback when all scripts have been loaded.

How to Use
================================================================
The library is a single function with two parameters.

```js
scriptLoader(scriptsToLoad, onLoaded)
```

* scriptsToLoad is the array of scripts to load.
* onLoaded is a callback that is called when all the scripts in scriptsToLoad have loaded (or failed to load).

scriptsToLoad Format
----------------------------------------------------------------
Each item in the scriptsToLoad array is processed in order and each item must complete (in either success or failure) before the next item is processed. Each item in scriptsToLoad is either a ScriptObject, a string, or an array. Any of these can be mixed in the same scriptsToLoad array. This gives you fine grained control over which scripts to load in order and which scripts to load in parallel.

###ScriptObject
A **ScriptObject** specifies two urls, a primary and a secondary. If the primary script fails to load, the secondary script is loaded. If the secondary script fails the object is skipped, and no script is loaded.

```js
{
    primaryUrl  : 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.1/angular.min.js',
    secondaryUrl: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.1/angular.min.js'
}
```

###URL String
A **URL String** is simple a string that points to the location of the script to load. You cannot specify a fallback with this kind of item.

###Array
An **Array** can contain **ScriptObjects** or **URL Strings**. Unlike the parent array, every item is downloaded in parallel.