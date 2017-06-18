'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var parseRouteParamToCorrectType = function parseRouteParamToCorrectType(paramValue) {
	if (!isNaN(paramValue)) {
		return parseInt(paramValue, 10);
	}

	if (paramValue === 'true' || paramValue === 'false') {
		return JSON.parse(paramValue);
	}

	return paramValue;
};

var extractRouteParams = function extractRouteParams(routeIdentifier, currentHash) {
	var splittedHash = currentHash.split('/');
	var splittedRouteIdentifier = routeIdentifier.split('/');

	return splittedRouteIdentifier.map(function (routeIdentifierToken, index) {
		if (routeIdentifierToken.indexOf(':', 0) === -1) {
			return null;
		}
		var routeParam = {};
		var key = routeIdentifierToken.substr(1, routeIdentifierToken.length - 1);
		routeParam[key] = splittedHash[index];
		return routeParam;
	}).filter(function (p) {
		return p !== null;
	}).reduce(function (acc, curr) {
		Object.keys(curr).forEach(function (key) {
			acc[key] = parseRouteParamToCorrectType(curr[key]);
		});
		return acc;
	}, {});
};

var findMatchingRouteIdentifier = function findMatchingRouteIdentifier(currentHash, routeKeys) {
	var splittedHash = currentHash.split('/');
	var firstHashToken = splittedHash[0];

	return routeKeys.filter(function (routeKey) {
		var splittedRouteKey = routeKey.split('/');
		var staticRouteTokensAreEqual = splittedRouteKey.map(function (routeToken, i) {
			if (routeToken.indexOf(':', 0) !== -1) {
				return true;
			}
			return routeToken === splittedHash[i];
		}).reduce(function (countInvalid, currentValidationState) {
			if (currentValidationState === false) {
				++countInvalid;
			}
			return countInvalid;
		}, 0) === 0;

		return routeKey.indexOf(firstHashToken, 0) !== -1 && staticRouteTokensAreEqual && splittedHash.length === splittedRouteKey.length;
	})[0];
};

var XMLHttpRequestFactory = window.XMLHttpRequest;

var loadTemplate = function loadTemplate(templateUrl, successCallback) {
	var xhr = new XMLHttpRequestFactory();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			successCallback(xhr.responseText);
		}
	};
	xhr.open('GET', templateUrl);
	xhr.send();
};

var renderTemplates = function renderTemplates(routeConfiguration, domEntryPoint, successCallback) {
	if (!routeConfiguration) {
		return;
	}

	if (routeConfiguration.templateString) {
		domEntryPoint.innerHTML = routeConfiguration.templateString;
		successCallback();
	}

	if (routeConfiguration.templateUrl) {
		loadTemplate(routeConfiguration.templateUrl, function (templateString) {
			domEntryPoint.innerHTML = templateString;
			successCallback();
		});
	}

	if (routeConfiguration.templateId) {
		var templateScript = document.getElementById(routeConfiguration.templateId);
		domEntryPoint.innerHTML = templateScript.text;
		successCallback();
	}
};

var createRouter = function createRouter(domEntryPoint) {
	var routes = {};
	var lastDomEntryPoint = domEntryPoint.cloneNode(true);
	var lastRouteHandler = null;

	var navigateTo = function navigateTo(hashUrl) {
		window.location.hash = hashUrl;
	};

	var otherwise = function otherwise(routeHandler) {
		routes['*'] = routeHandler;
	};

	var addRoute = function addRoute(hashUrl, routeHandler, data) {
		routes[hashUrl] = routeHandler;
		routes[hashUrl].data = data;
		return { addRoute: addRoute, otherwise: otherwise, navigateTo: navigateTo };
	};

	var initializeDomElement = function initializeDomElement() {
		if (!domEntryPoint.parentElement) {
			return;
		}

		var domClone = lastDomEntryPoint.cloneNode(true);
		domEntryPoint.parentElement.insertBefore(domClone, domEntryPoint);

		if (typeof domEntryPoint.remove === 'undefined') {
			domEntryPoint.removeNode(true);
		} else {
			domEntryPoint.remove();
		}

		domEntryPoint = domClone;
	};

	var disposeLastRoute = function disposeLastRoute() {
		if (!lastRouteHandler) return;
		if (typeof lastRouteHandler.dispose === 'undefined') return;
		lastRouteHandler.dispose(domEntryPoint);
	};

	var handleRouting = function handleRouting() {
		var defaultRouteIdentifier = '*';
		var currentHash = location.hash.slice(1);

		var maybeMatchingRouteIdentifier = findMatchingRouteIdentifier(currentHash, Object.keys(routes));
		var routeParams = {};
		if (maybeMatchingRouteIdentifier) {
			routeParams = extractRouteParams(maybeMatchingRouteIdentifier, currentHash);
		}

		var routeHandler = Object.keys(routes).indexOf(maybeMatchingRouteIdentifier) > -1 ? routes[maybeMatchingRouteIdentifier] : routes[defaultRouteIdentifier];

		if (!routeHandler) {
			return;
		}

		disposeLastRoute(routeHandler);

		// Memory last routeHandler
		lastRouteHandler = routeHandler;

		initializeDomElement();

		if (typeof routeHandler === 'function') {
			routeHandler(domEntryPoint, routeParams, routeHandler.data);
		} else {

			if (!routeHandler.templateString && !routeHandler.templateId && !routeHandler.templateUrl) {
				throw Error('No template configured for route ' + currentHash);
			}

			renderTemplates(routeHandler, domEntryPoint, function () {
				if (typeof routeHandler.routeHandler === 'function') {
					routeHandler.routeHandler(domEntryPoint, routeParams, routeHandler.data);
				}
			});
		}
	};

	if (window) {
		window.removeEventListener('hashchange', handleRouting);
		window.addEventListener('hashchange', handleRouting);
		window.removeEventListener('load', handleRouting);
		window.addEventListener('load', handleRouting);
	}

	return { addRoute: addRoute, otherwise: otherwise, navigateTo: navigateTo };
};

exports.createRouter = createRouter;
