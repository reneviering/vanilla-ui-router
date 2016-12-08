[![npm version](https://badge.fury.io/js/vanilla-ui-router.svg)](http://badge.fury.io/js/vanilla-ui-router)
[![Build Status](https://travis-ci.org/micromata/vanilla-ui-router.svg?branch=master)](https://travis-ci.org/micromata/vanilla-ui-router)
[![Coverage Status](https://coveralls.io/repos/github/micromata/vanilla-ui-router/badge.svg?branch=master)](https://coveralls.io/github/micromata/vanilla-ui-router?branch=master)
[![Code Climate](https://codeclimate.com/github/micromata/vanilla-ui-router/badges/gpa.svg)](https://codeclimate.com/github/micromata/vanilla-ui-router)
[![devDependency Status](https://david-dm.org/micromata/vanilla-ui-router/dev-status.svg?theme=shields.io)](https://david-dm.org/micromata/vanilla-ui-router#info=devDependencies)
[![Unicorn](https://img.shields.io/badge/unicorn-approved-ff69b4.svg?style=flat)](https://www.youtube.com/watch?v=qRC4Vk6kisY)

# Vanilla UI Router

> Simple vanilla JavaScript router to be used inside a single page app to add routing capabilities.

The router comes with zero dependencies and can be used with any other libraries. It's based on the [hashchange-Event](https://developer.mozilla.org/docs/Web/API/WindowEventHandlers/onhashchange).

## Installation

```
$ npm install --save vanilla-ui-router
```
*As UMD module this runs everywhere (ES6 modules, CommonJS, AMD and with good ol’ globals).*

## Usage
Let's assume your initial markup has the following structure:

```html
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="styles.min.css" />
</head>
<body>

	<!-- Entry point, dynamic content is rendered into this DOM element -->
	<main id="app"></main>

	<!-- Bundle where your JavaScript logic lives, even the router configuration -->
	<script src="bundle.js"></script>
</body>
</html>
```

Then you could configure the router with the following JavaScript:

```javascript
import {createRouter} from 'vanilla-ui-router';

// Initialize the router with the dynamic DOM entry point
const router = createRouter(document.getElementById('app'));

router

	// Start route: The server side URL without a hash
	.addRoute('', () => {
		/*
			Use navigateTo(…) to make dynamic route changes, i.e. to redirect to another route
		*/
		router.navigateTo('home');
	})

	.addRoute('home', (domEntryPoint) => {
		domEntryPoint.textContent = 'I am the home route.';
	})

	.addRoute('about/:aboutId/:editable', (domEntryPoint, routeParams) => {
		console.log('I am the about route.');

		/*
			routeParams are extracted from the URL and are casted to the correct type
			(Number/Boolean/String)
		*/
		console.log(routeParams); // => { aboutId: 42, editable:false }
	})

	/*
		If routes get more complex, e.g. you need to render a template URL,
		pass a configuration object as second parameter (instead of the function)
	*/
	.addRoute('route-with-template-url', {
		templateUrl: 'path/to/template.html' // is loaded and gets rendered
	})

	.addRoute('route-with-template-string/:id', {
		templateString: '<p>Lorem ipsum dolor.</p>',
		routeHandler: (domEntryPoint, routeParams) => {
			/*
			It's called just after rendering the template, so you can add route-specific logic.
			But only if needed!
			*/
		}
	})

	/*
		You can also define a templateId, i.e. if you have a template-script inside
		your markup like:

		<script type="text/template" id="template42">
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor, tenetur?
			</p>
		</script>
	*/
	.addRoute('route-with-template-id/:id', {
		templateId: 'template42'
	})

	.addRoute('route-with-dispose', {
		routeHandler: () => {},
		dispose: () => {
			// Is called before navigating to another route to do some cleanup if needed.
		}
	})

	.addRoute('inject-custom-data', {
		routeHandler: (domEntryPoint, routeParams, {customData}) => {
			// It's passed as the last parameter of the route, for instance to pass a redux store.
		},
	}, { customData: 'moep'}) // if you need to pass custom data to your routes

	.otherwise(() => {
		// If no route configuration matches, the otherwise route is invoked.
		console.log('I am the otherwise route');
		router.navigateTo('404');
	});

```

## License

Please be aware of the licenses of the components we use in this project. Everything else that has been developed by the contributions to this project is under [MIT License](LICENSE).
