/**
 * Loads a tiered set of scripts asynchronously. Includes the option to load fallback scripts as well.
 * @param scriptsToLoad An array of arrays of scripts to load.
 * @param onLoaded a callback that is called once ALL scripts have finished loading.
 */
function scriptLoader(scriptsToLoad, onLoaded) {
	//Prevents duplicate requests since the onerror event fires twice.
	var requests = {};

	var importScript = function (src, onSuccess, onError) {
		if(!!requests[src]) {
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
		requests[src] = true;

		return scriptElement;
	};

	var loadAsync = function (asyncScripts, callback) {
		var counter = asyncScripts.length;
		asyncScripts.forEach(function (scriptObject) {
			importScript(scriptObject.primaryUrl, function (event) {
				counter--;
			}, function () {
				if(!!scriptObject.secondaryUrl) {
					importScript(scriptObject.secondaryUrl, function () {
						counter--;
					}, function() {
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
			}, 500);
		})();
	};

	var loadSync = function (syncScripts, callback) {
		var previousFunction = callback;
		for (var j = (syncScripts.length - 1); j >= 0; j--) {

			var asyncScripts = syncScripts[j];
			previousFunction  = (function (item, prevFunction) {
				return function () {
					loadAsync(item, function() {
						prevFunction();
					});
				};
			})(asyncScripts, previousFunction);
		}

		previousFunction();
	};

	loadSync(scriptsToLoad, onLoaded);
}