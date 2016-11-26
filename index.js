export const createRouter = domEntryPoint => {
	let routes = {};

	const getRouterObject = () => {
		return { addRoute, otherwise, navigateTo };
	}

	const addRoute = (hashUrl, routeHandler) => {
		routes[hashUrl] = routeHandler;
		return getRouterObject();
	};

	const navigateTo = hashUrl => {
		window.location.hash = hashUrl;
	};

	const otherwise = routeHandler => {
		routes['*'] = routeHandler;
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

	const findMatchingRouteIdentifier = (currentHash, routeKeys) => {
	  const splittedHash = currentHash.split('/');
	  const firstHashToken = splittedHash[0];

	  return routeKeys
	    .filter(routeKey => {
	      const splittedRouteKey = routeKey.split('/');

	      const staticRouteTokensAreEqual = splittedRouteKey
	        .map((routeToken, i) => {
	          if(routeToken.indexOf(':', 0) !== -1) return true;
	          return routeToken === splittedHash[i];
	        })
	        .reduce((countInvalid, currentValidationState) => {
	          if (currentValidationState === false) {
	            ++countInvalid;
	          }
	          return countInvalid;
	        }, 0) === 0;

	      return routeKey.indexOf(firstHashToken, 0) !== -1 &&
	             staticRouteTokensAreEqual &&
	             splittedHash.length === splittedRouteKey.length;
	    })[0];
	};

	const extractRouteParams = (routeIdentifier, currentHash) => {
	  const splittedHash = currentHash.split('/');
	  const splittedRouteIdentifier = routeIdentifier.split('/');

	  return splittedRouteIdentifier
	    .map((routeIdentifierToken, index) => {
	      if (routeIdentifierToken.indexOf(':', 0) === -1) return null;
	        const routeParam = {};
	        const key = routeIdentifierToken.substr(1, routeIdentifierToken.length - 1);
	        routeParam[key] = splittedHash[index];
	        return routeParam;
	    })
	    .filter(p => p !== null)
	    .reduce((acc, curr) => {
	      Object.keys(curr).forEach(key => {
	        acc[key] = parseRouteParamToCorrectType(curr[key]);
	      })
	      return acc;
	    }, {});
	};

	const handleRouting = () => {
		const defaultRouteIdentifier = '*';
		const currentHash = location.hash.slice(1);

		const maybeMatchingRouteIdentifier = findMatchingRouteIdentifier(currentHash, Object.keys(routes));
	  let routeParams;
		if (maybeMatchingRouteIdentifier) {
			routeParams = extractRouteParams(maybeMatchingRouteIdentifier, currentHash);
		}

		const routeHandler = Object.keys(routes).indexOf(maybeMatchingRouteIdentifier) !== -1 ? routes[maybeMatchingRouteIdentifier] : routes[defaultRouteIdentifier];

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
