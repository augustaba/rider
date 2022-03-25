import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './global.css';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('#root'),
);
