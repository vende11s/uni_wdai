const ReactTestRenderer = require('react-test-renderer');
if (!ReactTestRenderer.createRoot) {
  ReactTestRenderer.createRoot = ReactTestRenderer.create;
}
global.window = global.window || {}; global.window.dispatchEvent = jest.fn();
