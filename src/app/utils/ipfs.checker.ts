const hashToTest = 'Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a'
const hashString = 'Hello from IPFS Gateway Checker'
const gateways = require('./ipfs.gateways.json');

export function getGateways(callback){
  gateways.forEach((gateway) => {
    const gatewayAndHash = gateway.replace(':hash', hashToTest)
    // opt-out from gateway redirects done by browser extension
    const testUrl = gatewayAndHash + '#x-ipfs-companion-no-redirect'
    fetch(testUrl)
      .then(res => res.text())
      .then((text) => {
        const matched = text.trim() === hashString.trim()
        if(matched) callback(gatewayAndHash);
      }).catch((err) => {
        console.log(gatewayAndHash, "down");
      })
  })
}