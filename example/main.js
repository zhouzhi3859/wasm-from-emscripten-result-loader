import wasm from './gps.wasm';

wasm.init().then(mod => {
  console.log('mod', mod);
});

