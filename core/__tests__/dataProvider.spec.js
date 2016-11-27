import { loadTemplate } from '../dataProvider';

// Add a simple XMLHttpRequest mock which already succeeds to test functionality of the dataProvider

const initXMLHttpReqestMock = shouldFail => {
	class XMLHttpRequestMock {
		constructor() {
			this.readyState = shouldFail === true ? 0 : 4;
		}
		onreadystatechange() {}
		open() {}
		send() {
			this.onreadystatechange();
		}
	}
	window.XMLHttpRequest = XMLHttpRequestMock;

};

describe('loadTemplate()', () => {
	test('invokes successCallback with template string if template is loaded', () => {
		initXMLHttpReqestMock(false);
		const spy = jest.fn();
		loadTemplate('', spy);

		expect(spy.mock.calls.length).toBe(1);
	});

	test('does not invoke successCallback if template could not get loaded', () => {
		initXMLHttpReqestMock(true);
		const spy = jest.fn();
		loadTemplate('', spy);

		expect(spy.mock.calls.length).toBe(0);
	});
});
