import Frame from './Frame';
import React from 'react';
import ReactDOM from 'react-dom';

window.addEventListener('load', () => {
  const root = document.createElement('div');
  root.id = 'framer';
  document.body.appendChild(root);

  ReactDOM.render(<Frame />, root);
});
