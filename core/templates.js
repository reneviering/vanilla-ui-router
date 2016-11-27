export const renderTemplates = (routeConfiguration, domEntryPoint) => {
	if(!routeConfiguration || !routeConfiguration.templateString) return;
	domEntryPoint.innerHTML = routeConfiguration.templateString;
};
