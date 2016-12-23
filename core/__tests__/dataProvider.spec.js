import {loadTemplate} from '../dataProvider';
jest.mock('../httpRequestFactory.js');

describe('loadTemplate()', () => {
	test('invokes successCallback with template string if template is loaded', () => {
		const spy = jest.fn();
		loadTemplate('/path/to/success', spy);
		expect(spy.mock.calls.length).toBe(1);
	});

	test('does not invoke successCallback if template could not get loaded', () => {
		const spy = jest.fn();
		loadTemplate('/path/to/error', spy);
		expect(spy.mock.calls.length).toBe(0);
	});

	test('does not invoke successCallback if template loading is not ready', () => {
		const spy = jest.fn();
		loadTemplate('/path/to/not/ready', spy);
		expect(spy.mock.calls.length).toBe(0);
	});
});
