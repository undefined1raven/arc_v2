


function dataCryptoOps(symsk: string, type: 'decrypt' | 'encrypt', payload: string) {//payload is either JSONstring to be encrypted or encryptedJSONstring containing iv and cipher params
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

 function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

async function symmetricDecrypt(cipher, key, iv) {
    return await crypto.subtle.decrypt({ name: 'AES-GCM', iv: str2ab(iv) }, key, str2ab(cipher)).then((decrypted) => {
        return new TextDecoder().decode(decrypted);
    });
}

 function sendMessage(message) {
     window.ReactNativeWebView.postMessage(message)
 }
 try {
     if (crypto.subtle !== undefined) {
        const jwk = JSON.parse('${symsk}');
        importSymmetricKey(jwk).then(key => {
            if('${type}' === 'encrypt' && '${typeof (payload)}' === 'string'){
                symmetricEncrypt('${payload}', key).then(res => {
                    sendMessage(JSON.stringify({taskID: 'dataEncryption', error: null, status: 'success', payload: JSON.stringify(res)}));
                    }).catch(e => {
                        sendMessage(JSON.stringify({taskID: 'dataEncryption', error: 'Encryption error', status: 'failed'}));
                    })
            }else{
                try{
                    sendMessage(JSON.stringify({taskID: 'dataDecryption', error: null, status: 'success', payload: JSON.stringify({hi: 'xx'})}));
                    // symmetricDecrypt(cipher, key, iv).then(res => {
                    // }).catch(e => {
                    //     sendMessage(JSON.stringify({taskID: 'dataDecryption', error: e, status: 'failed'}));
                    // })
                }catch(e){
                    sendMessage(JSON.stringify({
                     taskID: 'dataDecryption',
                     error: 'Encrypted components parsing failed',
                     status: 'failed'
                     }));
                }
            }
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


export { dataCryptoOps }