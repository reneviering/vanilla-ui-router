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

	if (routeConfiguration.templateId) {
		const templateScript = document.getElementById(routeConfiguration.templateId);
		domEntryPoint.innerHTML = templateScript.text;
	}
};
