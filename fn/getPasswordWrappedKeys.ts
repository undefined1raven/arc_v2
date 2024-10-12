function wrapKeysWithPasswordCode(
  password: string[],
  pk: string,
  symsk: string
) {
  return `
  document.title = 'Wrap Keys with backup codes';
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
                const privateKeyJWK = JSON.parse('${pk}');
                const secretSymmetricKeyJWK = JSON.parse('${symsk}');
                importPrivateKey(privateKeyJWK).then(pkActual => {
                  importSymmetricKey(secretSymmetricKeyJWK).then(symskActual => {
                    const recoveryCodes = JSON.parse('${password}');
                    console.log(recoveryCodes);

                    const promiseArrayPk = [];
                    const promiseArraySYMSK = [];

                    for(let ix = 0; ix < recoveryCodes.length; ix++){
                      promiseArrayPk.push(wrapCryptoKey(symskActual, recoveryCodes[ix], 'raw'));
                      promiseArraySYMSK.push(wrapCryptoKey(pkActual, recoveryCodes[ix], 'jwk'));
                    }

                    Promise.all(promiseArrayPk).then(wrapedPkKeys => {
                      console.log(wrapedPkKeys);
                      Promise.all(promiseArraySYMSK).then(wrapedSymKeys => {
                        console.log(wrapedSymKeys);
                        if(wrapedPkKeys.length === wrapedSymKeys.length){
                            const keyExport = [];
                            for(let ix = 0; ix < wrapedPkKeys.length; ix++){
                              const wrapedSymsk = wrapedSymKeys[ix];
                              const wrapedPk = wrapedPkKeys[ix];

                                             const transportReadyWrappedKey = JSON.stringify({
									                          key: stringToCharCodeArray(ab2str(wrapedSymsk.wrappedKey)),
									                          salt: stringToCharCodeArray(ab2str(wrapedSymsk.salt)),
									                          iv: stringToCharCodeArray(ab2str(wrapedSymsk.iv))
								                            })

                                            const transportReadyWrappedPrivateKey = JSON.stringify({
									                          key: stringToCharCodeArray(ab2str(wrapedPk.wrappedKey)),
									                          salt: stringToCharCodeArray(ab2str(wrapedPk.salt)),
									                          iv: stringToCharCodeArray(ab2str(wrapedPk.iv))
								                            })

                              keyExport.push({symsk: transportReadyWrappedKey, pk: transportReadyWrappedPrivateKey});
                            }
                              const payload = JSON.stringify(keyExport);
                            sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'success', error: null, payload: payload}))
                        }else{
                          sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to wrap keys | len difference after promise'}))
                        }
                      }).catch(e => {
                        sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to wrap symsk'}))
                      });
                    }).catch(e => {
                      sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to wrap keys'}))
                    })
                  }).catch(e => {
                    sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to import symsk'}))
                  })
                }).catch(e => {
                  sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to import pk'}))
                })

            }else{
              sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'dont have subtle crypto fml'}))
            }
          }catch(e){
              sendMessage(JSON.stringify({taskID: 'keyWrapping', error: e, status: 'failed'}));
          }
        `;
}

export { wrapKeysWithPasswordCode };
