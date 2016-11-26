// export const createRouter = domEntryPoint => {
//   const routes = new Map();
//
//   const addRoute = (hashUrl, routeHandler) => {
//     routes.set(hashUrl, routeHandler);
// 		return getRouterInstance();
//   };
//
// 	const otherwise = routeHandler => {
// 		routes.set('*', routeHandler);
// 	};
//
//   const navigateToHashUrl = hashUrl => {
//     location.hash = hashUrl;
//   };
//
// 	const getRouterInstance = () => {
// 		return { addRoute, navigateToHashUrl, otherwise }
// 	};
//
// 	const analyzeRoute = (currentHash) => {
// 		if (currentHash === '') {
// 			return {params: {}, isMatching: true, routeKey: ''};
// 		}
//
// 		const splittedHash = currentHash.split('/');
// 		const first = splittedHash[0];
// 		return Array.from(routes.keys())
// 			.filter(routeKey => {
// 				return routeKey.startsWith(first);
// 			})
// 			.reduce((acc, curr) => {
// 				const splittedRouteDef = curr.split('/');
//
// 				if (splittedRouteDef.length === splittedHash.length) {
// 					const params = [];
// 					const result = splittedRouteDef.map((routeDefItem, i) => {
// 						if(routeDefItem == splittedHash[i]) {
// 							return true;
// 						}
//
// 						if (routeDefItem.startsWith(':')) {
// 							let param = {};
// 							param[routeDefItem.substr(1, routeDefItem.length)] = splittedHash[i];
// 							params.push(param);
// 						}
// 						return routeDefItem;
// 					});
//
// 					const isMatching = result.filter(r => r === false).length === 0;
//
// 					if(isMatching) {
// 						const paramsObject = params.reduce((acc, curr) => {
// 							Object.keys(curr).forEach(key => {
// 								acc[key] = curr[key];
// 							});
// 							return acc;
// 						}, {});
// 						return {params: paramsObject, isMatching: true, routeKey: curr};
// 					}
// 				}
// 				return acc;
// 			}, {params: [], isMatching: false, route: null});
// 	}
//
// 	const callRouteHandlerOfRouteConfiguration = (routeHandler, analyzedRoute) => {
// 		if(routeHandler.handler && typeof routeHandler.handler === 'function') {
// 			routeHandler.handler(domEntryPoint, analyzedRoute.params);
// 		}
// 	};
//
//   const handleRouting = () => {
//     const defaultRouteIdentifier = '*';
//     const currentHash = location.hash.slice(1);
//
// 		const analyzedRoute = analyzeRoute(currentHash);
//
// 		console.log(routes.has(''), analyzedRoute.routeKey, analyzedRoute);
//     const routeHandler = routes.has(analyzedRoute.routeKey) ? routes.get(analyzedRoute.routeKey) : routes.get(defaultRouteIdentifier);
//     if (typeof routeHandler === 'function') {
//       routeHandler(domEntryPoint, analyzedRoute.params);
//     }
//
// 		if (typeof routeHandler === 'object') {
// 			if(routeHandler.templateUrl) {
// 				var xhr = new XMLHttpRequest();
// 				xhr.onreadystatechange = function () {
// 					if (xhr.readyState === 4) {
// 							domEntryPoint.innerHTML = xhr.responseText;
// 					}
// 				};
// 				xhr.open('GET', routeHandler.templateUrl);
// 				xhr.send();
// 			}else {
// 				callRouteHandlerOfRouteConfiguration(routeHandler, analyzedRoute);
// 			}
// 		}
//   };
//
//   if (window) {
// 		if (window.addEventListener) {
// 			window.removeEventListener('hashchange', handleRouting);
// 	    window.addEventListener('hashchange', handleRouting);
// 	    window.removeEventListener('load', handleRouting);
// 	    window.addEventListener('load', handleRouting);
// 		}else {
// 			window.attachEvent('onhashchange', handleRouting);
// 			window.attachEvent('onload', handleRouting);
// 		}
//   }
//   return getRouterInstance();
// };

export const createRouter = () => {
	let routes = new Map();

	const getRouterObject = () => {
		return { addRoute, otherwise };
	}

	const addRoute = (hashUrl, routeHandler) => {
		routes.set(hashUrl, routeHandler);
		return getRouterObject();
	};

	const otherwise = routeHandler => {
		routes.set('*', routeHandler);
	};

	const handleRouting = () => {
		const defaultRouteIdentifier = '*';
		const currentHash = location.hash.slice(1);

		const routeHandler = routes.has(currentHash) ? routes.get(currentHash) : routes.get(defaultRouteIdentifier);

		if (typeof routeHandler === 'function') {
			routeHandler();
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
