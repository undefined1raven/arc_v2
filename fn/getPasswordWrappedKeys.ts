


function wrapKeysWithPasswordCode(password: string, pk: string, symsk: string) {
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


     function sendMessage(message){
          window.ReactNativeWebView.postMessage(message)
        }
        try{
            if(crypto.subtle !== undefined){
                const privateKeyJWK = JSON.parse('${pk}');
                const secretSymmetricKeyJWK = JSON.parse('${symsk}');
                importPrivateKey(privateKeyJWK).then(pkActual => {
                  importSymmetricKey(secretSymmetricKeyJWK).then(symskActual => {
                    wrapCryptoKey(symskActual, '${password}', 'raw').then(wrapedSymsk => {
                      wrapCryptoKey(pkActual, '${password}', 'jwk').then(wrapedPk => {
                      const transportReadyWrappedKey = JSON.stringify({
									        key: ab2str(wrapedSymsk.wrappedKey),
									        salt: ab2str(wrapedSymsk.salt),
									        iv: ab2str(wrapedSymsk.iv)
								          })

                          const transportReadyWrappedPrivateKey = JSON.stringify({
									        key: ab2str(wrapedPk.wrappedKey),
									        salt: ab2str(wrapedPk.salt),
									        iv: ab2str(wrapedPk.iv)
								          })
                        const payload = JSON.stringify({symsk: transportReadyWrappedKey, pk: transportReadyWrappedPrivateKey});
                        sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'success', error: null, payload: payload}))
                    }).catch(e => {
                      sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to wrap pk'}))
                    })
                    }).catch(e => {
                      sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to wrap symsk'}))
                    })
                  }).catch(e => {
                    sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to import symsk'}))
                  })
                }).catch(e => {
                  sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'failed to import pk'}))
                })

            }else{
              sendMessage(JSON.stringify({taskID: 'keyWrapping', status: 'failed', error: 'smth'}))
            }
          }catch(e){b
              sendMessage(JSON.stringify({taskID: 'keyWrapping', error: e, status: 'failed'}));
          }
        `
}


export { wrapKeysWithPasswordCode }