requirejs.config({
  baseUrl: '',
  paths: {
    'flight': 'bower_components/flight'
  }
});

require(
  [
    'bower_components/flight-monitor/flight-monitor'
  ],
  function() {
    require(['app/boot/page'], function(initialize) {
      initialize();
    });
  }
);
