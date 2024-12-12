import Highcharts from 'highcharts';
import HighchartsStock from 'highcharts/modules/stock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';

// Initialize modules
if (typeof Highcharts === 'object') {
  HighchartsStock(Highcharts);
  HighchartsExporting(Highcharts);
  HighchartsExportData(Highcharts);
}

// Set global options
Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }
  },
  credits: {
    enabled: false
  },
  colors: ['#2196F3', '#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#3F51B5'],
});

export default Highcharts; 