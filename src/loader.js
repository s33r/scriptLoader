/**
 * Loads a tiered set of scripts asynchronously. Includes the option to load fallback scripts as well.
 * @param scriptsToLoad An array of arrays of scripts to load.
 * @param onLoaded a callback that is called once ALL scripts have finished loading.
 */
function scriptLoader(scriptsToLoad, onLoaded) {
	//Prevents duplicate requests since the onerror event fires twice.
	var requests = {};

	var importScript = function (src, onSuccess, onError) {
		if (!!requests[src]) {
			return;
		}

		var scriptElement   = document.createElement('script');
		scriptElement.src   = src;
		scriptElement.async = false;

		if (onError) {
			scriptElement.onerror = onError;
		}

		if (onSuccess) {
			scriptElement.onload = onSuccess;
		}

		document.head.appendChild(scriptElement);
		requests[src]       = true;

		return scriptElement;
	};

	var importStylesheet = function (src, onSuccess, onError) {
		if (!!requests[src]) {
			return;
		}

		var styleElement   = document.createElement('link');
		styleElement.rel   = 'stylesheet';
		styleElement.href  = src;
		styleElement.type  = 'text/css';

		if (onError) {
			styleElement.onerror = onError;
		}

		if (onSuccess) {
			//IE Doesn't Support onerror, only onload.
			styleElement.onload = function(event) {
				if(styleElement.sheet) {
					onError();
				} else {
					onSuccess();
				}
			};
		}

		document.head.appendChild(styleElement);
		requests[src]       = true;

		return styleElement;
	};

	var importItem = function(src, onSuccess, onError) {
		if(src.match(/(\.css)$/)) {
			importStylesheet(src, onSuccess, onError);
		} else if(src.match(/(\.js)$/)) {
			importScript(src, onSuccess, onError);
		}
	};

	var loadAsync = function (asyncScripts, callback) {
		var scriptsProxy = asyncScripts;
		if (!Array.isArray(scriptsProxy)) {
			scriptsProxy = [scriptsProxy];
		}

		var counter = scriptsProxy.length;
		scriptsProxy.forEach(function (scriptObject) {
			var proxy = scriptObject;

			if (typeof proxy === "string") {
				proxy = {
					primaryUrl: scriptObject
				};
			}

			importItem(proxy.primaryUrl, function (event) {
				counter--;
			}, function () {
				if (!!proxy.secondaryUrl) {
					importItem(proxy.secondaryUrl, function () {
						counter--;
					}, function () {
						counter--;
					});
				} else {
					counter--;
				}
			});
		});

		(function loop() {
			setTimeout(function () {
				if (counter > 0) {
					loop();
				} else {
					callback();
				}
			});
		})();
	};

	var loadSync = function (syncScripts, callback) {
		var previousFunction = callback;
		for (var j = (syncScripts.length - 1); j >= 0; j--) {

			var asyncScripts = syncScripts[j];
			previousFunction = (function (item, prevFunction) {
				return function () {
					loadAsync(item, function () {
						prevFunction();
					});
				};
			})(asyncScripts, previousFunction);
		}

		previousFunction();
	};

	loadSync(scriptsToLoad, onLoaded);
}