import {
	extractRouteParams,
	findMatchingRouteIdentifier
} from './core/routeParams';
import {renderTemplates} from './core/templates';

export const createRouter = domEntryPoint => {
	let routes = {};
	const lastDomEntryPoint = domEntryPoint.cloneNode(true);
	let lastRouteHandler = null;

	const navigateTo = hashUrl => {
		window.location.hash = hashUrl;
	};

	const otherwise = routeHandler => {
		routes['*'] = routeHandler;
	};

	const addRoute = (hashUrl, routeHandler, data) => {
		routes[hashUrl] = routeHandler;
		routes[hashUrl].data = data;
		return {addRoute, otherwise, navigateTo};
	};

	const initializeDomElement = () => {
		if (!domEntryPoint.parentElement) {
			return;
		}

		const domClone = lastDomEntryPoint.cloneNode(true);
		domEntryPoint.parentElement.insertBefore(domClone, domEntryPoint);

		if (typeof domEntryPoint.remove === 'undefined') {
			domEntryPoint.removeNode(true);
		} else {
			domEntryPoint.remove();
		}

		domEntryPoint = domClone;
	};

	const disposeLastRoute = () => {
		if (!lastRouteHandler) return;
		if (typeof lastRouteHandler.dispose === 'undefined') return;
		lastRouteHandler.dispose(domEntryPoint);
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

		disposeLastRoute(routeHandler);

		// Memory last routeHandler
		lastRouteHandler = routeHandler;

		initializeDomElement();

		if (typeof routeHandler === 'function') {
			routeHandler(domEntryPoint, routeParams, routeHandler.data);
		} else {

			if (!routeHandler.templateString && !routeHandler.templateId && !routeHandler.templateUrl) {
				throw Error(`No template configured for route ${currentHash}`);
			}

			renderTemplates(routeHandler, domEntryPoint, () => {
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

	return {addRoute, otherwise, navigateTo};
};
