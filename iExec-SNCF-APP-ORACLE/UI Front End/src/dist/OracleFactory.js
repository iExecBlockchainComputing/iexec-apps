"use strict";

const {
  IExec
} = require('iexec');

const {
  Web3Provider
} = require('ethers').providers;

const {
  createOracle,
  updateOracle,
  readOracle
} = require('./oracle');

class IExecOracleFactory {
  constructor(ethProvider) {
    let {
      ipfsGateway,
      oracleApp,
      oracleContract,
      iexecOptions = {}
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let iexec;

    try {
      iexec = new IExec({
        ethProvider
      }, {
        confirms: 3,
        ...iexecOptions
      });
    } catch (e) {
      throw Error('Unsupported ethProvider');
    }

    const ethersProvider = ethProvider.provider || new Web3Provider(ethProvider);

    this.createOracle = rawParams => createOracle({
      rawParams,
      iexec,
      ipfsGateway,
      oracleApp
    });

    this.updateOracle = function (paramSetOrCid) {
      let {
        workerpool
      } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return updateOracle({
        paramSetOrCid,
        iexec,
        ipfsGateway,
        workerpool,
        oracleApp,
        oracleContract
      });
    };

    this.readOracle = async function (paramSetOrCidOrOracleId) {
      let {
        dataType
      } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return readOracle({
        paramSetOrCidOrOracleId,
        dataType,
        ethersProvider,
        ipfsGateway
      });
    };

    this.getIExec = () => iexec;
  }

}

module.exports = IExecOracleFactory;