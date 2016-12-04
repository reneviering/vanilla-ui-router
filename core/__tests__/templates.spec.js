import {renderTemplates} from '../templates';

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
