function dataCryptoOps(
  symsk: string,
  type: "decrypt" | "encrypt",
  payload: string | null
) {
  //payload is either JSONstring to be encrypted or encryptedJSONstring containing iv and cipher params
  return `
 function ab2str(buf) {
     return String.fromCharCode.apply(null, new Uint8Array(buf));
 }

function ab2strA(buf){
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

 async function symmetricEncrypt(plaintext, key) {
     let encoded = new TextEncoder().encode(plaintext);
     let iv = crypto.getRandomValues(new Uint8Array(12));
     return await crypto.subtle.encrypt({
         name: 'AES-GCM',
         iv: iv
     }, key, encoded).then((encrypted) => {
         return {
             cipher: ab2strA(encrypted),
             iv: ab2strA(iv)
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

function decode(str){
    let utf8decoder = new TextDecoder();
    const originalObj = JSON.parse(str);
    const outArray = [];
    const objKeys = Object.keys(originalObj);
    for(let ix = 0; ix < objKeys.length; ix++){
        outArray.push(originalObj[ix])
    }
    const uint = new Uint8Array(outArray);
    return utf8decoder.decode(uint);
}

console.log('json present: ', \`${payload}\`)
 try {
     if (crypto.subtle !== undefined) {
        const jwk = JSON.parse('${symsk}');
        importSymmetricKey(jwk).then(key => {
            if('${type}' === 'encrypt' && '${typeof payload}' === 'string'){
            document.title = 'encrypting';
                symmetricEncrypt('${payload}', key).then(res => {
                    sendMessage(JSON.stringify({taskID: 'dataEncryption', error: null, status: 'success', payload: JSON.stringify(res)}));
                    }).catch(e => {
                        sendMessage(JSON.stringify({taskID: 'dataEncryption', error: 'Encryption error', status: 'failed'}));
                    })
            }else{
                document.title = 'decrypting';
                try{
                    const payloadA = '${payload}';
                    const rawIV = payloadA.split('^')[0];
                    const rawCipher = payloadA.split('^')[1];
                    symmetricDecrypt(decode(rawCipher), key, decode(rawIV)).then(res => {
                        sendMessage(JSON.stringify({taskID: 'dataDecryption', error: null, status: 'success', payload: JSON.stringify(res)}));
                    }).catch(e => {
                        console.log('error: ', e);
                        sendMessage(JSON.stringify({taskID: 'dataDecryption', error: e, status: 'failed'}));
                    })
                }catch(e){ 
                    sendMessage(JSON.stringify({
                     taskID: 'dataDecryption',
                     error: e,
                     status: 'failed'
                     }));
                     setTimeout(() => {
                        document.location.reload();
                    }, 5000)
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
          `;
}

export { dataCryptoOps };
