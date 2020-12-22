import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';

import { name, version, author } from './package.json';

// banner
const banner =
  `${'/*!\n' + ' * '}${name}.js v${version}\n` +
  ` * (c) 2020-${new Date().getFullYear()} ${author}\n` +
  ` * Released under the MIT License.\n` +
  ` */`;

const basePlugin = [
  json(),
  typescript({
    exclude: 'node_modules/**',
    typescript: require('typescript'),
  }),
  sourceMaps(),
];

// 支持输出 []
export default [
  // .js, .cjs.js, .esm.js
  {
    input: './src/index.ts',
    output: [
      // umd development version with sourcemap
      {
        file: `dist/${name}.js`,
        format: 'umd',
        name,
        banner,
        sourcemap: true,
      },
      // cjs and esm version
      {
        file: `dist/${name}.cjs.js`,
        format: 'cjs',
        banner,
      },
      // cjs and esm version
      {
        file: `dist/${name}.esm.js`,
        format: 'es',
        banner,
      },
    ],
    plugins: [...basePlugin, filesize()],
  },
  // .min.js
  {
    input: './src/index.ts',
    output: [
      // umd with compress version
      {
        file: `dist/${name}.min.js`,
        format: 'umd',
        name,
        banner,
      },
    ],
    plugins: [...basePlugin, terser(), filesize()],
  },
];
