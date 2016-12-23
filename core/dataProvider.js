import {XMLHttpRequestFactory} from './httpRequestFactory.js';

export const loadTemplate = (templateUrl, successCallback) => {
	var xhr = new XMLHttpRequestFactory();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			successCallback(xhr.responseText);
		}
	};
	xhr.open('GET', templateUrl);
	xhr.send();
};
