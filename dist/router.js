(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.router = global.router || {})));
}(this, (function (exports) { 'use strict';

var createRouter = function createRouter(domEntryPoint) {
	var routes = {};

	var getRouterObject = function getRouterObject() {
		return { addRoute: addRoute, otherwise: otherwise };
	};

	var addRoute = function addRoute(hashUrl, routeHandler) {
		routes[hashUrl] = routeHandler;
		return getRouterObject();
	};

	var otherwise = function otherwise(routeHandler) {
		routes['*'] = routeHandler;
	};

	var parseRouteParamToCorrectType = function parseRouteParamToCorrectType(paramValue) {
		if (!isNaN(paramValue)) {
			return parseInt(paramValue, 10);
		}

		if (paramValue === 'true' || paramValue === 'false') {
			return JSON.parse(paramValue);
		}

		return paramValue;
	};

	var findMatchingRouteIdentifier = function findMatchingRouteIdentifier(currentHash, routeKeys) {
		var splittedHash = currentHash.split('/');
		var firstHashToken = splittedHash[0];

		return routeKeys.filter(function (routeKey) {
			var splittedRouteKey = routeKey.split('/');

			var staticRouteTokensAreEqual = splittedRouteKey.map(function (routeToken, i) {
				if (routeToken.indexOf(':', 0) !== -1) return true;
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

	var extractRouteParams = function extractRouteParams(routeIdentifier, currentHash) {
		var splittedHash = currentHash.split('/');
		var splittedRouteIdentifier = routeIdentifier.split('/');

		return splittedRouteIdentifier.map(function (routeIdentifierToken, index) {
			if (routeIdentifierToken.indexOf(':', 0) === -1) return null;
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

	var handleRouting = function handleRouting() {
		var defaultRouteIdentifier = '*';
		var currentHash = location.hash.slice(1);

		var maybeMatchingRouteIdentifier = findMatchingRouteIdentifier(currentHash, Object.keys(routes));
		var routeParams = void 0;
		if (maybeMatchingRouteIdentifier) {
			routeParams = extractRouteParams(maybeMatchingRouteIdentifier, currentHash);
		}

		var routeHandler = Object.keys(routes).indexOf(maybeMatchingRouteIdentifier) !== -1 ? routes[maybeMatchingRouteIdentifier] : routes[defaultRouteIdentifier];

		if (typeof routeHandler === 'function') {
			routeHandler(domEntryPoint, routeParams);
		}
	};

	if (window) {
		window.removeEventListener('hashchange', handleRouting);
		window.addEventListener('hashchange', handleRouting);
		window.removeEventListener('load', handleRouting);
		window.addEventListener('load', handleRouting);
	}

	return getRouterObject();
};

exports.createRouter = createRouter;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=router.js.map
