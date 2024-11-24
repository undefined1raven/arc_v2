function encrypt(
  symsk: string,
  payload: string | null,
  transactionID: string | undefined | null
) {
  //payload is either JSONstring to be encrypted or encryptedJSONstring containing iv and cipher params
  return `
    document.title = 'Encryption Worker';
   function ab2str(buf) {
       return String.fromCharCode.apply(null, new Uint8Array(buf));
   }
  
  function ab2strA(buf){
      return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }
  
  function arrayBufferToString(buffer) {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}
async function symmetricEncrypt(plaintext, key) {
    let encoded = new TextEncoder().encode(plaintext);
    let iv = window.crypto.getRandomValues(new Uint8Array(12));
    return await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, encoded).then((encrypted) => {
        return { cipher: ab2str(encrypted), iv: ab2str(iv) };
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
function encode(str) {
    const enc = new TextEncoder().encode(str);
    return JSON.stringify(enc);
  }
  console.log('[Encryption] string payload present: ', \`${payload}\`, " | Tid: ",\`${transactionID}\`)
   try {
       if (crypto.subtle !== undefined) {
          const jwk = JSON.parse('${symsk}');
          importSymmetricKey(jwk).then(key => {
           symmetricEncrypt('${payload}', key).then(res => {
           const stringifiedRes = JSON.stringify(res);
            window.ReactNativeWebView.postMessage(JSON.stringify({taskID: 'encrypt', status: 'success', error: null, payload: stringifiedRes, transactionID: '${transactionID}'}));
                    }).catch(e => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({taskID: 'dataEncryption', error: 'Encryption error', status: 'failed'}));
                    })
          }).catch(e => {
              sendMessage(JSON.stringify({
               taskID: 'dataEncryption',
               error: 'Key import failed',
               status: 'failed'
           }));
            return;
  
          })
       } else {
          sendMessage(JSON.stringify({
               taskID: 'dataEncryption',
               error: 'Subtle Crypto INOP',
               status: 'failed'
           }));
            return;
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

export { encrypt };
