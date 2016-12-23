import {renderTemplates} from '../templates';
jest.mock('../dataProvider.js');

describe('template rendering', () => {
	test('renders templateString, if it is defined inside the routeConfiguration', () => {
		let domEntryPointMock = {
			innerHTML: ''
		};
		const spy = jest.fn();
		renderTemplates({templateString: '<p>I am the template string.</p>'}, domEntryPointMock, spy);
		expect(domEntryPointMock.innerHTML).toEqual('<p>I am the template string.</p>');
		expect(spy.mock.calls.length).toEqual(1);
	});

	test('nothing is rendered if no templateString is defined inside the routeConfiguration', () => {
		const d = {
			innerHTML: ''
		};
		const spy = jest.fn();
		renderTemplates({}, d, spy);
		expect(d.innerHTML).toEqual('');
		expect(spy.mock.calls.length).toEqual(0);
	});

	test('renders templateUrl, if it is defined inside the routeConfiguration', () => {
		let domEntryPointMock = {
			innerHTML: ''
		};

		const spy = jest.fn();
		renderTemplates({templateUrl: 'path/to/template.html'}, domEntryPointMock, spy);
		expect(domEntryPointMock.innerHTML).toEqual('<p>Rendered from template.html</p>');
		expect(spy.mock.calls.length).toEqual(1);
	});

	test('renders templateId, if it is defined inside the routeConfiguration', () => {
		let domEntryPointMock = {
			innerHTML: ''
		};

		const templateScript = document.createElement('script');
		templateScript.setAttribute('id', 'template4711');
		templateScript.setAttribute('type', 'text/template');
		templateScript.innerHTML = '<p>Rendered from template script with id 4711</p>';
		document.body.appendChild(templateScript);

		const spy = jest.fn();
		renderTemplates({templateId: 'template4711'}, domEntryPointMock, spy);
		expect(domEntryPointMock.innerHTML).toEqual('<p>Rendered from template script with id 4711</p>');
		expect(spy.mock.calls.length).toEqual(1);
	});

	test('nothing is rendered if no routeConfiguration is defined', () => {
		const d = {
			innerHTML: ''
		};
		const spy = jest.fn();
		renderTemplates(null, d);
		expect(d.innerHTML).toEqual('');
		expect(spy.mock.calls.length).toEqual(0);
	});
});
