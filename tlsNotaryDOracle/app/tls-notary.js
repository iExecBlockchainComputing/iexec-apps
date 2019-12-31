const https   = require('https');
const ethers  = require('ethers');
const fs      = require('fs');

const root                = 'iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath    = `${root}/callback.iexec`;
const errorFilePath       = `${root}/error.iexec`;

const forge = require('node-forge');
/*****************************************************************************
 *                                   TOOLS                                   *
 *****************************************************************************/
const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const cat = (path) => {
	try { return fs.readFileSync(path).toString(); } catch (e) { return null; }
}

/*****************************************************************************
 *                                  CONFIG                                   *
 *****************************************************************************/


/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

const checkUrl = process.argv.slice(2);

/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/

/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
// create TLS client
var client = forge.tls.createConnection({
    server: false,
    caStore: /* Array of PEM-formatted certs or a CA store object */,
    sessionCache: {},
    // supported cipher suites in order of preference
    cipherSuites: [
      forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
      forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
    virtualHost: 'example.com',
    verify: function(connection, verified, depth, certs) {
      if(depth === 0) {
        var cn = certs[0].subject.getField('CN').value;
        if(cn !== 'example.com') {
          verified = {
            alert: forge.tls.Alert.Description.bad_certificate,
            message: 'Certificate common name does not match hostname.'
          };
        }
      }
      return verified;
    },
    connected: function(connection) {
      console.log('connected');
      // send message to server
      connection.prepare(forge.util.encodeUtf8('Hi server!'));
      /* NOTE: experimental, start heartbeat retransmission timer
      myHeartbeatTimer = setInterval(function() {
        connection.prepareHeartbeatRequest(forge.util.createBuffer('1234'));
      }, 5*60*1000);*/
    },
    /* provide a client-side cert if you want
    getCertificate: function(connection, hint) {
      return myClientCertificate;
    },
    /* the private key for the client-side cert if provided */
    getPrivateKey: function(connection, cert) {
      return myClientPrivateKey;
    },
    tlsDataReady: function(connection) {
      // TLS data (encrypted) is ready to be sent to the server
      sendToServerSomehow(connection.tlsData.getBytes());
      // if you were communicating with the server below, you'd do:
      // server.process(connection.tlsData.getBytes());
    },
    dataReady: function(connection) {
      // clear data from the server is ready
      console.log('the server sent: ' +
        forge.util.decodeUtf8(connection.data.getBytes()));
      // close connection
      connection.close();
    },
    /* NOTE: experimental
    heartbeatReceived: function(connection, payload) {
      // restart retransmission timer, look at payload
      clearInterval(myHeartbeatTimer);
      myHeartbeatTimer = setInterval(function() {
        connection.prepareHeartbeatRequest(forge.util.createBuffer('1234'));
      }, 5*60*1000);
      payload.getBytes();
    },*/
    closed: function(connection) {
      console.log('disconnected');
    },
    error: function(connection, error) {
      console.log('uh oh', error);
    }
  });
  
  // start the handshake process
  client.handshake();
  
  // when encrypted TLS data is received from the server, process it
  client.process(encryptedBytesFromServer);
  
  // create TLS server
  var server = forge.tls.createConnection({
    server: true,
    caStore: /* Array of PEM-formatted certs or a CA store object */,
    sessionCache: {},
    // supported cipher suites in order of preference
    cipherSuites: [
      forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
      forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
    // require a client-side certificate if you want
    verifyClient: true,
    verify: function(connection, verified, depth, certs) {
      if(depth === 0) {
        var cn = certs[0].subject.getField('CN').value;
        if(cn !== 'the-client') {
          verified = {
            alert: forge.tls.Alert.Description.bad_certificate,
            message: 'Certificate common name does not match expected client.'
          };
        }
      }
      return verified;
    },
    connected: function(connection) {
      console.log('connected');
      // send message to client
      connection.prepare(forge.util.encodeUtf8('Hi client!'));
      /* NOTE: experimental, start heartbeat retransmission timer
      myHeartbeatTimer = setInterval(function() {
        connection.prepareHeartbeatRequest(forge.util.createBuffer('1234'));
      }, 5*60*1000);*/
    },
    getCertificate: function(connection, hint) {
      return myServerCertificate;
    },
    getPrivateKey: function(connection, cert) {
      return myServerPrivateKey;
    },
    tlsDataReady: function(connection) {
      // TLS data (encrypted) is ready to be sent to the client
      sendToClientSomehow(connection.tlsData.getBytes());
      // if you were communicating with the client above you'd do:
      // client.process(connection.tlsData.getBytes());
    },
    dataReady: function(connection) {
      // clear data from the client is ready
      console.log('the client sent: ' +
        forge.util.decodeUtf8(connection.data.getBytes()));
      // close connection
      connection.close();
    },
    /* NOTE: experimental
    heartbeatReceived: function(connection, payload) {
      // restart retransmission timer, look at payload
      clearInterval(myHeartbeatTimer);
      myHeartbeatTimer = setInterval(function() {
        connection.prepareHeartbeatRequest(forge.util.createBuffer('1234'));
      }, 5*60*1000);
      payload.getBytes();
    },*/
    closed: function(connection) {
      console.log('disconnected');
    },
    error: function(connection, error) {
      console.log('uh oh', error);
    }
  });
  
  // when encrypted TLS data is received from the client, process it
  server.process(encryptedBytesFromClient);