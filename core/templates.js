import { loadTemplate } from './dataProvider';

export const renderTemplates = (routeConfiguration, domEntryPoint) => {
	if (!routeConfiguration) return;

	if (routeConfiguration.templateString) {
		domEntryPoint.innerHTML = routeConfiguration.templateString;
	}

	if (routeConfiguration.templateUrl) {
		loadTemplate(routeConfiguration.templateUrl, templateString => {
			domEntryPoint.innerHTML = templateString;
		});
	}
};
