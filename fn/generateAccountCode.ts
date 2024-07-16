


function genenerateAccountCode() {
    return `
        async function exportCryptoKey(key) {
    const exported = await crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
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
            sendMessage(JSON.stringify({taskID: 'accountGen', status: 'success', symkey: jwk, error: null}));
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