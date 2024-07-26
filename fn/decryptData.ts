


function decryptData(cipher: string, symsk: string, iv: string) {
    return `
 function ab2str(buf) {
     return String.fromCharCode.apply(null, new Uint8Array(buf));
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
        if('${cipher}' && '${iv}'){
            const jwk = JSON.parse('${symsk}');
            importSymmetricKey(jwk).then(key => {
                symmetricDecrypt('${cipher}', key, '${iv}').then(res => {
                    sendMessage(JSON.stringify({taskID: 'dataDecryption', error: null, status: 'success', paylaod: JSON.stringify(res)}));
                    }).catch(e => {
                        sendMessage(JSON.stringify({taskID: 'dataDecryption', error: 'Decryption error', status: 'failed'));
                        })
                        }).catch(e => {
                            sendMessage(JSON.stringify({
                                taskID: 'dataDecryption',
                                error: 'Key import failed',
                            status: 'failed'
                        }));
                                
                    })
        }else{
            sendMessage(JSON.stringify({
             taskID: 'dataDecryption',
             error: 'Invalid Inputs',
             status: 'failed'
         }));
        
        }

     } else {
        sendMessage(JSON.stringify({
             taskID: 'dataDecryption',
             error: 'Subtle Crypto INOP',
             status: 'failed'
         }));
     }
 } catch (e) {
     sendMessage(JSON.stringify({
         taskID: 'dataDecryption',
         error: e,
         status: 'failed'
     }));
 }
          `
}


export { decryptData }