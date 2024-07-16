


function genenerateAccountCode() {
  return `
        async function exportCryptoKey(key) {
    const exported = await crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
}

async function exportCryptoKey(key) {
    const exported = await crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
}
  function getNewKey() {///key pair
    return crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    },
        true,
        ["encrypt", "decrypt"]).then((key) => {
            return key;
        }).catch(e => console.log(e));
}

     function sendMessage(message){
          window.ReactNativeWebView.postMessage(message)
        }
        try{
            if(crypto.subtle !== undefined){
              crypto.subtle.generateKey({
        name: "AES-GCM",
        length: 256,
    },
        true,
        ["encrypt", "decrypt"]).then((key) => {
          exportCryptoKey(key).then(jwk => {
            const symsk = jwk;
            getNewKey().then(keys => {
                const privateKey = keys.privateKey;
                const publicKey = keys.publicKey;
                exportCryptoKey(privateKey).then((exportedPrivateKey) => {
          				exportCryptoKey(publicKey).then((exportedPublicKey) => {
                    sendMessage(JSON.stringify({publicKey: exportedPublicKey, pk: exportedPrivateKey, taskID: 'accountGen', status: 'success', symkey: jwk, error: null}));
				          }).catch(e => {
                sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: 'failed to export pk'}))
              });
			            }).catch(e => {
                sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: 'failed to export public key'}))
              });
              }).catch(e => {
                sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: 'failed to gen key pair'}))
              })
          }).catch(e => {
              sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: e}))
          })
        }).catch(e => {sendMessage(JSON.stringify({taskID: 'accountGen', error: e, status: 'failed'}))});
            }else{
              sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: 'smth'}))
            }
          }catch(e){
              sendMessage(JSON.stringify({taskID: 'accountGen', error: e, status: 'failed'}));
          }
        
        `
}


export { genenerateAccountCode }