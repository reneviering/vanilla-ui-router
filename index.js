export const createRouter = domEntryPoint => {
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

	const parseRouteParamToCorrectType = paramValue => {
		if(!isNaN(paramValue)) {
			return parseInt(paramValue, 10);
		}

		if (paramValue === 'true' || paramValue === 'false') {
			return JSON.parse(paramValue);
		}

		return paramValue;
	};

	const analyzeRoute = currentHash => {
		if (currentHash === '') {
			return {params: {}, isMatching: true, routeKey: ''};
		}

		const splittedHash = currentHash.split('/');
		const first = splittedHash[0];
		return Array.from(routes.keys())
			.filter(routeKey => {
				return routeKey.startsWith(first);
			})
			.reduce((acc, curr) => {
				const splittedRouteDef = curr.split('/');

				if (splittedRouteDef.length === splittedHash.length) {
					const params = [];
					const result = splittedRouteDef.map((routeDefItem, i) => {
						if(routeDefItem == splittedHash[i]) {
							return true;
						}

						if (routeDefItem.startsWith(':')) {
							let param = {};
							param[routeDefItem.substr(1, routeDefItem.length)] = splittedHash[i];
							params.push(param);
						}
						return routeDefItem;
					});

					const isMatching = result.filter(r => r === false).length === 0;

					if(isMatching) {
						const paramsObject = params.reduce((acc, curr) => {
							Object.keys(curr).forEach(key => {
								acc[key] = parseRouteParamToCorrectType(curr[key]);
							});
							return acc;
						}, {});
						return {params: paramsObject, isMatching: true, routeKey: curr};
					}
				}
			}, {params: [], isMatching: false, routeKey: null});
	}

	const handleRouting = () => {
		const defaultRouteIdentifier = '*';
		const currentHash = location.hash.slice(1);

		const analyzedRoute = analyzeRoute(currentHash);
		const routeHandler = routes.has(analyzedRoute.routeKey) ? routes.get(analyzedRoute.routeKey) : routes.get(defaultRouteIdentifier);

		if (typeof routeHandler === 'function') {
			routeHandler(domEntryPoint, analyzedRoute.params);
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
