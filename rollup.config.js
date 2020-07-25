import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';


export default {
    input: 'web/spmod.js',
    output: {
        file: 'public/dist/bundle.js',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        commonjs(),
        terser(),
        resolve(),
        postcss({
            extract: 'spmod.css',
            minimize: true
        })
    ]
}