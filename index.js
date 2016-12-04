import {
	extractRouteParams,
	findMatchingRouteIdentifier
} from './core/routeParams';
import {renderTemplates} from './core/templates';

export const createRouter = domEntryPoint => {
	let routes = {};
	const lastDomEntryPoint = domEntryPoint.cloneNode(true);

	const navigateTo = hashUrl => {
		window.location.hash = hashUrl;
	};

	const otherwise = routeHandler => {
		routes['*'] = routeHandler;
	};

	const addRoute = (hashUrl, routeHandler) => {
		routes[hashUrl] = routeHandler;
		return {addRoute, otherwise, navigateTo};
	};

	const initializeDomElement = () => {
		if (!domEntryPoint.parentElement) {
			return;
		}

		const domClone = lastDomEntryPoint.cloneNode(true);
		domEntryPoint.parentElement.insertBefore(domClone, domEntryPoint);
		domEntryPoint.remove();
		domEntryPoint = domClone;
	};

	const handleRouting = () => {
		const defaultRouteIdentifier = '*';
		const currentHash = location.hash.slice(1);

		const maybeMatchingRouteIdentifier = findMatchingRouteIdentifier(currentHash, Object.keys(routes));
		let routeParams = {};
		if (maybeMatchingRouteIdentifier) {
			routeParams = extractRouteParams(maybeMatchingRouteIdentifier, currentHash);
		}

		const routeHandler = Object.keys(routes).indexOf(maybeMatchingRouteIdentifier) > -1 ? routes[maybeMatchingRouteIdentifier] : routes[defaultRouteIdentifier];

		if (!routeHandler) {
			return;
		}

		initializeDomElement();

		if (typeof routeHandler === 'function') {
			routeHandler(domEntryPoint, routeParams);
		} else {

			renderTemplates(routeHandler, domEntryPoint);

			if (typeof routeHandler.routeHandler === 'function') {
				routeHandler.routeHandler(domEntryPoint, routeParams);
			}
		}
	};

	if (window) {
		window.removeEventListener('hashchange', handleRouting);
		window.addEventListener('hashchange', handleRouting);
		window.removeEventListener('load', handleRouting);
		window.addEventListener('load', handleRouting);
	}

	return {addRoute, otherwise, navigateTo};
};
