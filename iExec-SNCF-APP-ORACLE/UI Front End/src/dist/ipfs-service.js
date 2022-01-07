"use strict";

const Ipfs = require('ipfs');

const CID = require('cids');

const fetch = require('cross-fetch');

const {
  getLogger
} = require('./logger');

const {
  DEFAULT_IPFS_GATEWAY
} = require('./conf');

const log = getLogger('ipfs-service');

const get = async function (cid) {
  let {
    ipfsGateway = DEFAULT_IPFS_GATEWAY
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const multiaddr = "/ipfs/".concat(cid.toString());
  const publicUrl = "".concat(ipfsGateway).concat(multiaddr);
  const res = await fetch(publicUrl);

  if (!res.ok) {
    throw Error("Failed to load content from ".concat(publicUrl));
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const add = async function (content) {
  let {
    ipfsGateway = DEFAULT_IPFS_GATEWAY
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const ipfs = await Ipfs.create();

  try {
    // not released yet
    // if (ipfsConfig && ipfsConfig.pinService) {
    //   await ipfs.pin.remote.service
    //     .add('pin-service', ipfsConfig.pinService)
    //     .catch((e) => log(e));
    // }
    const {
      cid
    } = await ipfs.add(content);
    await ipfs.pin.add(cid, {
      timeout: 10000
    }).catch(e => log('Ipfs add pin failed', e));
    await get(cid.toString(), {
      ipfsGateway
    });
    await ipfs.stop();
    return cid.toString();
  } catch (e) {
    if (typeof ipfs.stop === 'function') {
      await ipfs.stop();
    }

    throw e;
  }
};

const isCid = value => {
  try {
    const cid = new CID(value);
    return CID.isCID(cid);
  } catch (e) {
    return false;
  }
};

module.exports = {
  add,
  get,
  isCid
};