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

let lastHash;

const simulateHashChange = hash => {
	if(lastHash !== hash) {
		window.location.hash = hash;
		hashChangeHandlers.forEach(handler => handler());
	}
};

const simulateLoad = hash => {
	window.location.hash = hash;
	loadHandlers.forEach(handler => handler());
};

const clearHandlers = () => {
	hashChangeHandlers = [];
	loadHandlers = [];
};

describe('router', () => {
	let domEntryPoint;

	beforeAll(() => {
		domEntryPoint = document.createElement('main');
		domEntryPoint.setAttribute('id', 'app');
		document.body.appendChild(domEntryPoint);
	});

	beforeEach(() => {
		clearHandlers();
	});

	test('invokes registered routes correctly', () => {
		const router = createRouter();
		const spy = jest.fn();
		router.addRoute('', spy);
		simulateLoad('');
		simulateHashChange('');
		expect(spy.mock.calls.length).toBe(2);
	});

	test('passes the domElement to each routeHandler as first parameter', () => {
		const router = createRouter(domEntryPoint);
		const spy = jest.fn();
		router.addRoute('', spy);
		simulateLoad('');
		simulateHashChange('');

		const firstRouteHandlerParameter = spy.mock.calls[0][0];
		expect(firstRouteHandlerParameter).toBe(domEntryPoint);
	});

	test('passes the route params to each routeHandler as second parameter', () => {
		const router = createRouter(domEntryPoint);
		const spy = jest.fn();
		router
			.addRoute('', () => {})
			.addRoute('route1/:param1/details/:param2/:param3', spy);
		simulateLoad('');
		simulateHashChange('route1/42/details/stringValue/true');

		const expectedRouteParams = {
			param1: 42,
			param2: 'stringValue',
			param3: true
		};

		const secondRouteHandlerParameter = spy.mock.calls[0][1];
		expect(secondRouteHandlerParameter).toEqual(expectedRouteParams);
	});

	describe('a not registered hash is invoked', () => {
		test('no routeHandler is called', () => {
			const router = createRouter();
			const spy = jest.fn();
			router.addRoute('registered-route', spy);
			simulateLoad('');
			simulateHashChange('not-registered-route');
			expect(spy.mock.calls.length).toBe(0);
		});

		describe('the otherwise route is registered', () => {
			test('the otherwise handler is called', () => {
				const router = createRouter();
				const spy = jest.fn();
				const otherwiseSpy = jest.fn();
				router
					.addRoute('', () =>{})
					.addRoute('registered-route', spy)
					.otherwise(otherwiseSpy);
				simulateLoad('');
				simulateHashChange('not-registered-route');
				expect(spy.mock.calls.length).toBe(0);
				expect(otherwiseSpy.mock.calls.length).toBe(1);
			});
		});
	});

	describe('navigateTo(...)', () => {
		test('navigates dynamically to a specific route', () => {
			const router = createRouter(domEntryPoint);
			const spy = jest.fn();
			router
				.addRoute('', () => {
					router.navigateTo('home');
				})
				.addRoute('home', spy);
				simulateLoad('');
				simulateHashChange('');
			expect(window.location.hash).toEqual('#home');
		});
	});
});
