import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Highcharts from 'highcharts';
import 'highcharts/modules/stock';
import 'highcharts/themes/dark-unica';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
