/**
 * Loads a tiered set of scripts asynchronously. Includes the option to load fallback scripts as well.
 * @param scriptsToLoad An array of arrays of scripts to load.
 * @param onLoaded a callback that is called once ALL scripts have finished loading.
 */
function scriptLoader(scriptsToLoad, onLoaded) {
	var importScript = function (src, onSuccess, onError) {
		console.log('src = ' + src);
		var scriptElement   = document.createElement('script');
		scriptElement.src   = src;
		scriptElement.async = false;
		document.head.appendChild(scriptElement);

		if (onError) {
			scriptElement.onerror = onError;
		}

		if (onSuccess) {
			scriptElement.onload = onSuccess;
		}



		return scriptElement;
	};

	var loadAsync = function (asyncScripts, callback) {
		var counter = asyncScripts.length;
		asyncScripts.forEach(function (scriptObject) {
			importScript(scriptObject.primaryUrl, function (event) {
				console.log('Loaded Primary: ' + scriptObject.primaryUrl);
				counter--;
				return false;
			}, function () {
				if(!!scriptObject.secondaryUrl) {
					importScript(scriptObject.secondaryUrl, function () {
						console.log('Loaded Secondary: ' + scriptObject.secondaryUrl);
						counter--;
						return false;
					}, function () {
						console.error('Failed to load primary or secondary: ' + scriptObject.secondaryUrl);
						return false;
					});
				} else {
					console.error('Failed to load primary and no secondary is defined.');
				}

				return false;
			});
		});

		(function loop() {
			setTimeout(function () {
				if (counter > 0) {
					console.log('counter Check: ' + counter);
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