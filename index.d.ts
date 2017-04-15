declare module 'vanilla-ui-router' {
	export function createRouter(domEntryPoint: Node): Router;

	export interface Router {
		navigateTo(hashUrl: string): void;
		otherwise(routeHandler: (domEntryPoint?: Node, routeParams?: any, customData?: any) => void): void;
		addRoute(hashUrl: string, routeHandler: (domEntryPoint?: Node, routeParams?: any, customData?: any) => void | RouteConfiguration, data): Router
	}

	export interface RouteConfiguration {
		templateString?: string,
		templateUrl?: string
		templateId?: string,
		routeHandler: (domEntryPoint?: Node, routeParams?: any, customData?: any) => void,
		dispose?: () => void
	}
}
