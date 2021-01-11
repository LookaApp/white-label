import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import url from '@rollup/plugin-url';
import resolve from '@rollup/plugin-node-resolve';

import path from "path";

const extensions = [ '.js', '.jsx', '.ts', '.tsx' ];

const name = 'RollupTypeScriptBabel';

const isProduction = process.env.NODE_ENV === 'production';

const sharedConfig = () => ({
	// Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
	// https://rollupjs.org/guide/en/#external
	external: [],

	plugins: [
		// Allows node_modules resolution
		resolve({ extensions }),

		// Allow bundling cjs modules. Rollup doesn't understand cjs
		commonjs(),

		// Compile TypeScript/JavaScript files
		babel({
			extensions,
			babelHelpers: 'bundled',
			include: [ 'hostingapp/**/*'  ]
		}),

		// Create an index.html file in dist
		html({ title: "Host app mock", publicPath: "//localhost:4000/",
			meta: [{ charset: 'utf-8' }, { name: "viewport", content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0"}],
		}),
		
		// Preliminary attemt to reach compatiblity with react libs
		alias({
			entries: [
				{ find: 'react', replacement: 'preact/compat' },
				{ find: 'react-dom', replacement: 'preact/compat' }
			]
		}),

		url({ limit: 300, destDir: "whitelabel/dist", fileName:"[name][extname]" }), 
		
	],

	manualChunks(id) {
		if (id.includes('node_modules')) {
			// Return the directory name following the last `node_modules`.
			// Usually this is the package, but it could also be the scope.
			const dirs = id.split(path.sep);
			return dirs[dirs.lastIndexOf('node_modules') + 1];
		}
	},

	watch: {
		buildDelay: 2000
	}
})

export default (CLIArgs) => {
	const bundle = [{
		input: './hostingapp/app.tsx',
		output: [
			{
				entryFileNames: isProduction ? "[name]-[hash].js" : "[name].js",
				dir: 'hostingapp/dist/',
				format: 'es',
				minifyInternalExports: isProduction,
			}
		],
		...sharedConfig(),
	}];

	return bundle;
};
