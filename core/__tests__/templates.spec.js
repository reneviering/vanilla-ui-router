import { renderTemplates } from '../templates';

describe('template rendering', () => {
	test('renders templateString, if it is defined inside the routeConfiguration', () => {
		let domEntryPointMock = {
			innerHTML: ''
		};
		renderTemplates({templateString: '<p>I am the template string.</p>'}, domEntryPointMock);
		expect(domEntryPointMock.innerHTML).toEqual('<p>I am the template string.</p>');
	});

	test('nothing is rendered if no templateString is defined inside the routeConfiguration', () => {
		const d = {
			innerHTML: ''
		};
		renderTemplates({}, d);
		expect(d.innerHTML).toEqual('');
	});

	test('nothing is rendered if no routeConfiguration is defined', () => {
		const d = {
			innerHTML: ''
		};
		renderTemplates(null, d);
		expect(d.innerHTML).toEqual('');
	});
});
