Buses NYC
=========

Provides Buses and Route information using  the MTA Bus Time API.


Basic Usage
-----------


```js
$(function() {
  var apiKey = ""; // <-- Your api key
  var mta = new MtaBusTime(apiKey);
  
  mta.getBuses('b63', '', function(buses) {
    console.log(buses);
  });

  mta.getRoute('b63', function(route) {
    console.log(route);
  });
});
```
