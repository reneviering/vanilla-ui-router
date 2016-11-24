import {createRouter} from '../index.js';
let hashChangeHandlers = [];
let loadHandlers = [];
// window mock
window.addEventListener = (eventName, handler) => {
	if(eventName === 'hashchange') {
		hashChangeHandlers.push(handler);
	}

	if(eventName === 'load') {
		loadHandlers.push(handler);
	}
};

let lastHash = '';

const simulateHashChange = hash => {
	if(lastHash !== hash) {
		window.location.hash = hash;
		hashChangeHandlers.forEach(handler => handler(hash));
	}

};

const simulateLoad = () => {
	window.location.hash = '';
	loadHandlers.forEach(handler => handler(''));
};

const clearHandlers = () => {
	hashChangeHandlers = [];
	loadHandlers = [];
};

describe('router', () => {
	test('invokes registered routes correctly', () => {
		clearHandlers();
		const router = createRouter();
		const spy = jest.fn();
		router.addRoute('', spy);
		simulateLoad();
		simulateHashChange('');
		expect(spy.mock.calls.length).toBe(1);
	});

	describe('a not registered hash is invoked', () => {
		test('no routeHandler is called', () => {
			clearHandlers();
			const router = createRouter();
			const spy = jest.fn();
			router.addRoute('registered-route', spy);
			simulateLoad();
			simulateHashChange('not-registered-route');
			expect(spy.mock.calls.length).toBe(0);
		});

		describe('the otherwise route is registered', () => {
			test('the otherwise handler is called', () => {
				clearHandlers();
				const router = createRouter();
				const spy = jest.fn();
				const otherwiseSpy = jest.fn();
				router
					.addRoute('registered-route', spy);
				simulateLoad();
				simulateHashChange('not-registered-route');
				expect(spy.mock.calls.length).toBe(0);
				expect(otherwiseSpy.mock.calls.length).toBe(0);
			});
		});
	});
})
