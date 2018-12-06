// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  var socket = io.connect();
  socket.on('server message', function(msg) {
    if (msg.key && msg.key == Cookies.get('wpa_key') && msg.alert) {
      Api.setResponsePayload('{"speech":{"text":"' + msg.alert + '"}}');
    }
  });

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };

  // Send a message request to the server
  function sendRequest(text, context) {
    // Build request payload
    var payloadToWatson = {};
    payloadToWatson.input = {
      text: text,
      url: config.URL,
      wpa: Cookies.get('wpa_key'),
      avatar: Cookies.get('avatar'),
      location: Cookies.get('location'),
      userid: Cookies.get('userid'),
      language: Cookies.get('language')
    }
    if (context) {
      payloadToWatson.context = context;
    }

    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.setResponsePayload(http.responseText);
      }
    };

    // Send request
    http.send(JSON.stringify(payloadToWatson));
    
    // obfuscate the wpa key
    payloadToWatson.input.wpa = `${payloadToWatson.input.wpa.substring(0,7)}...`
    
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(JSON.stringify(payloadToWatson));
    }

  }
}());
