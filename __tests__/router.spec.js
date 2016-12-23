import {createRouter} from '../index.js';

jest.mock('../core/dataProvider.js');

const simulateHashChange = hash => {
	window.location.hash = hash;
	window.dispatchEvent(new Event('hashchange'));
};

const simulateLoad = hash => {
	window.location.hash = hash;
	window.dispatchEvent(new Event('load'));
};

describe('router', () => {
	let domEntryPoint;

	beforeAll(() => {
		domEntryPoint = document.createElement('main');
		domEntryPoint.setAttribute('id', 'app');
		document.body.appendChild(domEntryPoint);
	});

	beforeEach(() => {
		domEntryPoint.innerHTML = '';
	});

	test('invokes registered routes correctly', () => {
		const router = createRouter(domEntryPoint);
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
			const router = createRouter(domEntryPoint);
			const spy = jest.fn();
			router.addRoute('registered-route', spy);
			simulateLoad('');
			simulateHashChange('not-registered-route');
			expect(spy.mock.calls.length).toBe(0);
		});

		describe('the otherwise route is registered', () => {
			test('the otherwise handler is called', () => {
				const router = createRouter(domEntryPoint);
				const spy = jest.fn();
				const otherwiseSpy = jest.fn();
				router
					.addRoute('', () => {})
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
				.addRoute('', () => {
					router.navigateTo('home');
				})
				.addRoute('home', spy);
			simulateLoad('');
			simulateHashChange('');
			expect(window.location.hash).toEqual('#home');
		});
	});

	describe('Templating', () => {
		describe('Adding a route with templateString inside the options', () => {
			test('templateString is rendered before calling the routeHandler', () => {
				const router = createRouter(domEntryPoint);
				const spy = jest.fn();
				router.addRoute('', {
					templateString: '<p>I am the default route</p>',
					routeHandler: spy
				});
				simulateLoad('');
				simulateHashChange('');

				setTimeout(() => {
					expect(domEntryPoint.innerHTML).toEqual('<p>I am the default route</p>');
					expect(spy.mock.calls.length).toBe(2);
				}, 0);

			});

			describe('no routeHandler is defined', () => {
				test('no error occurs', () => {
					const init = () => {
						const router = createRouter(domEntryPoint);
						router.addRoute('', {
							templateString: '<p>I am the default route</p>'
						});
						simulateLoad('');
						simulateHashChange('');
					};

					expect(init).not.toThrow();

				});
			});
		});

		describe('Adding a route with templateUrl inside the options', () => {
			test('template is loaded from templateUrl and the result is rendered before calling the routeHandler', () => {
				const router = createRouter(domEntryPoint);
				const spy = jest.fn();
				const expectedRenderedTemplate = '<p>Rendered from template.html</p>';
				router.addRoute('', {
					templateUrl: 'path/to/template.html',
					routeHandler: spy
				});
				simulateLoad('');
				simulateHashChange('');

				setTimeout(() => {
					expect(domEntryPoint.innerHTML).toEqual(expectedRenderedTemplate);
					expect(spy.mock.calls.length).toBe(2);
				}, 0);

			});
		});

		describe('Adding a route with templateId inside the options', () => {
			test('template which defined id is rendered before calling the routeHandler', () => {
				const templateScript = document.createElement('script');
				templateScript.setAttribute('id', 'template42');
				templateScript.setAttribute('type', 'text/template');
				templateScript.innerHTML = '<p>Rendered from template.html</p>';
				document.body.appendChild(templateScript);

				const router = createRouter(domEntryPoint);
				const spy = jest.fn();
				router.addRoute('', {
					templateId: 'template42',
					routeHandler: spy
				});
				simulateLoad('');
				simulateHashChange('');

				setTimeout(() => {
					expect(domEntryPoint.innerHTML).toEqual('<p>Rendered from template.html</p>');
					expect(spy.mock.calls.length).toBe(2);
				}, 0);

			});
		});

	});

	describe('Disposing routes', () => {
		describe('Navigate to a new route', () => {
			test('the last route is disposed if a dispose function is defined inside route configuration', () => {
				const router = createRouter(domEntryPoint);
				const spy = jest.fn();
				router
					.addRoute('', {
						routeHandler: () => {},
						dispose: spy
					})
					.addRoute('home', {
						routeHandler: () => {},
						templateString: 'asdfasfasf',
						dispose: () => {}
					});
				simulateHashChange('');
				simulateHashChange('home');

				setTimeout(() => {
					expect(spy.mock.calls.length).toEqual(1);
				}, 0);

			});
		});
	});

	describe('Defining some extra data to a route', () => {
		test('data is passed as last parameter into the simplest routeHandler function', () => {
			const router = createRouter(domEntryPoint);
			const spy = jest.fn();
			const dataToPass = 'data to pass';
			router
				.addRoute('', spy, {dataToPass});
			simulateHashChange('');

			setTimeout(() => {
				expect(spy.mock.calls[0][2]).toEqual({dataToPass});
			}, 0);

		});

		test('data is passed as last parameter into routeHandler function of routes with more complex configuration', () => {
			const router = createRouter(domEntryPoint);
			const spy = jest.fn();
			const dataToPass = 'data to pass';

			router
				.addRoute('', {
					templateId: 'template42',
					routeHandler: spy
				}, {dataToPass});
			simulateHashChange('');

			setTimeout(() => {
				expect(spy.mock.calls[0][2]).toEqual({dataToPass});
			}, 0);

		});
	});

	describe('with IE9', () => {
		test('no error is thrown, because of the domNode.remove()', () => {
			const domEntryPointMock = {
				parentElement: {
					insertBefore: () => {}
				},
				cloneNode: () => domEntryPointMock,
				removeNode: jest.fn(),
				remove: undefined
			};

			const router = createRouter(domEntryPointMock);
			router
				.addRoute('', () => {})
				.addRoute('home', () => {});
			simulateHashChange('');
			simulateHashChange('home');
			setTimeout(() => {
				expect(domEntryPointMock.removeNode.mock.calls.length).toEqual(1);
			});
		});
	});
});
