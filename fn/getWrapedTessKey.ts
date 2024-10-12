function getWrapedTessKey(createConfirmPIN: string) {
  return `
  document.title = 'Tess Symkey gen';
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
  
  function getKeyMaterial(password) {
      const enc = new TextEncoder();
      return crypto.subtle.importKey(
          "raw",
          enc.encode(password),
          { name: "PBKDF2" },
          false,
          ["deriveBits", "deriveKey"]
      );
  }
  
  function getKey(keyMaterial, salt) {
      return crypto.subtle.deriveKey(
          {
              "name": "PBKDF2",
              salt: salt,
              "iterations": 100000,
              "hash": "SHA-256"
          },
          keyMaterial,
          { "name": "AES-CBC", "length": 256 },
          true,
          ["wrapKey", "unwrapKey"]
      );
  }
  
  
   async function wrapCryptoKey(keyToWrap, password, exportFormat) {
    // get the key encryption key
    const keyMaterial = await getKeyMaterial(password);
    let salt = crypto.getRandomValues(new Uint8Array(16));
    const wrappingKey = await getKey(keyMaterial, salt);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const wrappedKey = await crypto.subtle.wrapKey(
        exportFormat,
        keyToWrap,
        wrappingKey,
        { name: "AES-CBC", iv: iv }
    );
  
    return { wrappedKey: wrappedKey, salt: salt, iv: iv };
  }
  function importSymmetricKey(jwk) {
      return crypto.subtle.importKey(
          "jwk",
          jwk,
          {
              name: "AES-GCM",
              length: 256,
          },
          true,
          ["encrypt", "decrypt"],
      );
  }
  
  function importPrivateKey(jwk) {
      return crypto.subtle.importKey(
          "jwk",
          jwk,
          {
              name: "RSA-OAEP",
              hash: 'SHA-256',
          },
          true,
          ["decrypt"],
      );
  }

  function getNewSymmetricKey() {
    return window.crypto.subtle.generateKey({
        name: "AES-GCM",
        length: 256,
    },
        true,
        ["encrypt", "decrypt"]).then((key) => {
            return key;
        }).catch(e => console.log(e));
}

async function wrapCryptoKey(keyToWrap, password) {
    // get the key encryption key
    const keyMaterial = await getKeyMaterial(password);
    let salt = window.crypto.getRandomValues(new Uint8Array(16));
    const wrappingKey = await getKey(keyMaterial, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const wrappedKey = await window.crypto.subtle.wrapKey(
        "raw",
        keyToWrap,
        wrappingKey,
        { name: "AES-CBC", iv: iv }
    );

    return { wrappedKey: wrappedKey, salt: salt, iv: iv };
}
  
  function ab2str(buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
  
  function stringToCharCodeArray(str) {
  let stringActual = str;
  if (str === undefined) {
    throw new Error("stringToCharCodeArray: str is undefined");
  } else {
    if (typeof str !== "string") {
      stringActual = str.toString();
    }
  }
  const charCodeArray = [];
  for (let i = 0; i < stringActual.length; i++) {
    charCodeArray.push(stringActual.charCodeAt(i));
  }
  return charCodeArray;
}
       function sendMessage(message){
            window.ReactNativeWebView.postMessage(message)
          }
          try{
              if(crypto.subtle !== undefined){
                    getNewSymmetricKey().then(tess_simkey => {
                        wrapCryptoKey(tess_simkey, '\`${createConfirmPIN}\`')
                            .then((res) => {
                                console.log(res);
                                const payload = {
									key: stringToCharCodeArray(ab2str(res.wrappedKey)),
									salt: stringToCharCodeArray(ab2str(res.salt)),
									iv: stringToCharCodeArray(ab2str(res.iv))
								}
                                sendMessage(JSON.stringify({taskID: 'tessSymkeyWrappingSuccess', payload: JSON.stringify(payload), status: 'success'}));
                            })
                            .catch((e) => {
                                    sendMessage(JSON.stringify({taskID: 'failed to wrap new symmetric key', error: e, status: 'failed'}));
                            });                    
                    }).catch(e => {
                        sendMessage(JSON.stringify({taskID: 'failed to create new symmetric key', error: e, status: 'failed'}));
                    })
              }else{
                sendMessage(JSON.stringify({taskID: 'tessSymkeyWrappingFailed', status: 'failed', error: 'smth'}))
              }
            }catch(e){b
                sendMessage(JSON.stringify({taskID: 'tessSymkeyWrappingFailed', error: e, status: 'failed'}));
            }
          `;
}

export { getWrapedTessKey };
