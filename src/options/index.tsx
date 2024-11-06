import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app';
import './index.css';


const appElement = document.getElementById('app') as HTMLElement;
ReactDOM.createRoot(appElement).render(<App />);