import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app';
import './index.css';


function buildRoot(): Element {
	const root = document.createElement('div');
	root.setAttribute('id', 'WebDesign');
	document.body.append(root);
	return root;
}
ReactDOM.createRoot(buildRoot()).render(<App />);