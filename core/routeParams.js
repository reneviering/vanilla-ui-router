export const parseRouteParamToCorrectType = paramValue => {
	if (!isNaN(paramValue)) {
		return parseInt(paramValue, 10);
	}

	if (paramValue === 'true' || paramValue === 'false') {
		return JSON.parse(paramValue);
	}

	return paramValue;
};

export const extractRouteParams = (routeIdentifier, currentHash) => {
	const splittedHash = currentHash.split('/');
	const splittedRouteIdentifier = routeIdentifier.split('/');

	return splittedRouteIdentifier.map((routeIdentifierToken, index) => {
		if (routeIdentifierToken.indexOf(':', 0) === -1) {
			return null;
		}
		const routeParam = {};
		const key = routeIdentifierToken.substr(1, routeIdentifierToken.length - 1);
		routeParam[key] = splittedHash[index];
		return routeParam;
	})
	.filter(p => p !== null)
	.reduce((acc, curr) => {
		Object.keys(curr).forEach(key => {
			acc[key] = parseRouteParamToCorrectType(curr[key]);
		});
		return acc;
	}, {});
};

export const findMatchingRouteIdentifier = (currentHash, routeKeys) => {
	const splittedHash = currentHash.split('/');
	const firstHashToken = splittedHash[0];

	return routeKeys
		.filter(routeKey => {
			const splittedRouteKey = routeKey.split('/');
			const staticRouteTokensAreEqual = splittedRouteKey
				.map((routeToken, i) => {
					if (routeToken.indexOf(':', 0) !== -1) {
						return true;
					}
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
