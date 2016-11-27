import { loadTemplate } from '../dataProvider';

// Add a simple XMLHttpRequest mock which already succeeds to test functionality of the dataProvider
class XMLHttpRequestMock {
	constructor() {
		this.readyState = 4;
	}
	onreadystatechange() {}
	open() {}
	send() {
		this.onreadystatechange();
	}
}

window.XMLHttpRequest = XMLHttpRequestMock;

describe('loadTemplate()', () => {
	test('invokes successCallback with template string if template is loaded', () => {
		const spy = jest.fn();
		loadTemplate('', spy);

		expect(spy.mock.calls.length).toBe(1);
	});
});
