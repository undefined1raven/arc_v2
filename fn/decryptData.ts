


function decryptData(JSONString: string, symsk: string) {
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
        const {iv, cipher} = JSON.parse(${JSONString});
        if(iv && cipher){
            const jwk = JSON.parse('${symsk}');
            importSymmetricKey(jwk).then(key => {
                symmetricDecrypt(cipher, key, iv).then(res => {
                    sendMessage(JSON.stringify({taskID: 'dataEncryption', error: null, status: 'success', paylaod: JSON.stringify(res)}));
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
        }
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


export { decryptData }