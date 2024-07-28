


function encryptData(JSONString: string, symsk: string) {
    return `
 function ab2str(buf) {
     return String.fromCharCode.apply(null, new Uint8Array(buf));
 }
 async function symmetricEncrypt(plaintext, key) {
     let encoded = new TextEncoder().encode(plaintext);
     let iv = crypto.getRandomValues(new Uint8Array(12));
     return await crypto.subtle.encrypt({
         name: 'AES-GCM',
         iv: iv
     }, key, encoded).then((encrypted) => {
         return {
             cipher: ab2str(encrypted),
             iv: ab2str(iv)
         };
     });
 }

 function importSymmetricKey(jwk) {
     return crypto.subtle.importKey(
         "jwk",
         jwk, {
             name: "AES-GCM",
             length: 256,
         },
         true,
         ["encrypt", "decrypt"],
     );
 }

 function sendMessage(message) {
     window.ReactNativeWebView.postMessage(message)
 }
 try {
     if (crypto.subtle !== undefined) {
        const jwk = JSON.parse('${symsk}');
        importSymmetricKey(jwk).then(key => {
            symmetricEncrypt('${JSONString}', key).then(res => {
                sendMessage(JSON.stringify({taskID: 'dataEncryption', error: null, status: 'success', payload: JSON.stringify(res)}));
            }).catch(e => {
                sendMessage(JSON.stringify({taskID: 'dataEncryption', error: 'Encryption error', status: 'failed'}));
            })
        }).catch(e => {
            sendMessage(JSON.stringify({
             taskID: 'dataEncryption',
             error: 'Key import failed',
             status: 'failed'
         }));

        })
     } else {
        sendMessage(JSON.stringify({
             taskID: 'dataEncryption',
             error: 'Subtle Crypto INOP',
             status: 'failed'
         }));
     }
 } catch (e) {
     sendMessage(JSON.stringify({
         taskID: 'dataEncryption',
         error: e,
         status: 'failed'
     }));
 }
          `
}


export { encryptData }