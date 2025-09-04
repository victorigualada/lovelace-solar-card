import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default {
  input: ['src/solar-card.ts'],
  output: {
    dir: './dist',
    format: 'es',
  },
  plugins: [
    resolve(),
    json(),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
    serve({
      contentBase: './dist',
      host: '0.0.0.0',
      port: 5000,
      allowCrossOrigin: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
  ],
};
