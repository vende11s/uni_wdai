const ReactTestRenderer = require('react-test-renderer');
if (!ReactTestRenderer.createRoot) {
  ReactTestRenderer.createRoot = ReactTestRenderer.create;
}
