import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'index.js',
	dest: 'dist/umd/vanilla-ui-router.min.js',
	format: 'umd',
	moduleName: 'vanillaUIRouter',
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
		uglify()
	]
};
