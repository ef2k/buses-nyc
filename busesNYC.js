/*
 * Buses NYC - A wrapper for the MTA BusTime API
 * http://github.com/eddflrs/buses-nyc
 * @author Eddie Flores
 * @license MIT License
 */

/*global jQuery */

(function (root, $) {
  "use strict";

  var MtaBusTime, config, url, searchUrl, vehicleMonitoringUrl;

  url = "http://bustime.mta.info/api/siri/";
  searchUrl = "http://bustime.mta.info/api/search";

  config = {
    key: "",
    url: url,
    searchUrl: searchUrl,
    vehicleMonitoringUrl: url + "vehicle-monitoring.json",
    stopMonitoringUrl: url + "stop-monitoring.json",
    opRef: "MTA"
  };

  /*
   * @public
   * @constructor
   */
  MtaBusTime = function (apiKey) {
    if (!apiKey) {
      throw new Error("API key must be passed as argument");
    }
    config.key = apiKey;
  };

  /*
   * @public
   * Returns the buses for the requested busline.
   */
  MtaBusTime.prototype.getBuses = function (bus, direction, cb) {

    var data = {
      key: config.key,
      LineRef: bus.toUpperCase(),
      OperatorRef: config.opRef
    };

    if (direction || direction === 0) {
      data.DirectionRef = direction;
    }

    var busPromise = $.ajax({
      type: 'GET',
      url: config.vehicleMonitoringUrl,
      data: data,
      dataType: "jsonp"
    });

    busPromise.done(function (data) {
      var monitored = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0],
        vehicles = monitored.VehicleActivity;
      cb(vehicles);
    });

    busPromise.fail(function (error) {
      throw new Error('Failed to retrieve buses.');
    });
  };

  MtaBusTime.prototype.monitorStop = function (stopId, cb) {

    var data = {
      key: config.key,
      OperatorRef: config.opRef,
      MonitoringRef: stopId, // Comes from the GTFS data (stops.txt)
      // LineRef: "MTA NYCT_B63", // AgencyId + routeId
      DirectionRef: 0, // 0 or 1
      StopMonitoringDetailLevel: 'normal', // To get stop data after target stop, use 'calls' as value.
      // MaximumNumberOfCallsOnwards:,
      // MaximumStopVisits:, // Upper bound
      // MinimumStopVisitsPerLine: // Lower bound
    };

    var stopPromise = $.ajax({
      type: 'GET',
      url: config.stopMonitoringUrl,
      data: data,
      dataType: "jsonp"
    });

    stopPromise.done(function (data) {
      console.log('Stop monitoring result: ', data);
      cb(data);
    });

    stopPromise.fail(function (error) {
      console.error('Failed to get stop monitoring: ', error);
    });
  };

  /*
   * @public
   * Returns the bus route information.
   */
  MtaBusTime.prototype.getRoute = function (bus, cb) {
    var data = {
      "q": bus
    };

    var routePromise = $.ajax({
      type: 'GET',
      url: config.searchUrl,
      data: data,
      dataType: 'jsonp'
    });

    routePromise.done(function (data) {
      var route = data.searchResults.matches[0];
      cb(route);
    });

    routePromise.fail(function () {
      throw new Error('Failed to retrieve the route.');
    });
  };
  root.MtaBusTime = MtaBusTime;
}(this, jQuery));
