import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
	entry: 'index.js',
	dest: 'dist/vanilla-ui-router.js',
	format: 'umd',
	moduleName: 'vanillaUIRouter',
	sourceMap: true,
	plugins: [
		resolve({
			jsnext: true,
			main: true,
			browser: true
		}),
		commonjs(),
		babel({
			babelrc: false,
			presets: ['es2015-rollup']
		}),
		sourcemaps()
	]
};
