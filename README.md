# CPP to WASM Webpack Loader
![](https://img.shields.io/badge/version-0.0.2-green.svg?)
[![](https://img.shields.io/badge/nodejs->=8.0-green.svg?)](https://nodejs.org/en/)
[![](https://img.shields.io/badge/npm->=5.4-blue.svg)](https://www.npmjs.com/)
![](https://img.shields.io/badge/license-MIT-000000.svg)
[![Build Status](https://www.travis-ci.org/zhouzhi3859/wasm-from-emscripten-result-loader.svg?branch=master)](https://www.travis-ci.org/zhouzhi3859/wasm-from-emscripten-result-loader)

Load wasm and glue js source files directly into javascript with a zero bloat. \
The module refers to the [cpp-wasm-loader](https://github.com/ClickSimply/cpp-wasm-loader), thanks for those source code.


## Installation
1. Install Emscripten following the instructions [here](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html).
2. Run `npm i wasm-from-emscripten-result-loader --save-dev`.
3. Add this object to the `rules` section of your webpack build:
```js
{
  test: /\.wasm$/,
  type: 'javascript/auto',
  use: [
    {
      loader: 'wasm-from-emscripten-result-loader'
    },
  ]
}
```
4. Make sure `.wasm` are in the webpack resolve object:
```js
resolve: {
  extensions: ['.js', '.wasm']
}
```

## Minimal Example
You can also view a complete working example on github [here](https://github.com/ClickSimply/cpp-wasm-loader/tree/master/example).

**add.c**
```c
#include <emscripten.h>

extern "C"
{
	/* Declare Javascript function for use in C/C++ */
	extern int sub(int a, int b);

	EMSCRIPTEN_KEEPALIVE /* <= Needed to export this function to javascript "module.exports" */
	int add(int a, int b)
	{
		return a + b;
	}

}
```
### Build
```asciidoc
  emcc --bind ./add.cc -s WASM=1 -o ./add.js -std=c++11 --bind
```
note: ```-s WASM=1 -o {path}/{name}.js``` is Required

**main.js**
```js
import wasm from './add.wasm';
wasm.init((imports) => {
	// custom javascript function that can be called from C;
	imports._sub = (a, b) => a - b;
	return imports;
}).then((module) => {
	console.log(module.exports.add(1, 2)); // 3
	console.log(module.memory) // Raw ArrayBuffer Memory object
	console.log(module.memoryManager) // Memory Manager Class
	console.log(module.raw) // The complete unmodified return value of the webassembly init promise.
}).catch((err) => {
	console.error(err);
})
```


## MIT License

Copyright 2018 zhi.zhou

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
