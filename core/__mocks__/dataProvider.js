export const loadTemplate = (templateUrl, successCallback) => {
	switch (templateUrl) {
		case 'path/to/template.html':
			successCallback('<p>Rendered from template.html</p>');
			break;
	}
};
