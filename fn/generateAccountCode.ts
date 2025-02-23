import { defaultFeatureConfig } from "@/app/config/defaultFeatureConfig";

function genenerateAccountCode() {
  return `
    document.title = 'Account Gen Worker';

        async function exportCryptoKey(key) {
    const exported = await crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
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

 function ab2str(buf) {
     return String.fromCharCode.apply(null, new Uint8Array(buf));
 }


 function encodeEncrypted(encrypted){
     return JSON.stringify(
        stringToCharCodeArray(JSON.stringify(encrypted))
      );
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
            const symsk = jwk;
            getNewKey().then(keys => {
                const privateKey = keys.privateKey;
                const publicKey = keys.publicKey;
                exportCryptoKey(privateKey).then((exportedPrivateKey) => {
          				exportCryptoKey(publicKey).then((exportedPublicKey) => {
                    const configPromises = [];

                    configPromises.push(symmetricEncrypt('${JSON.stringify(
                      defaultFeatureConfig.arc
                    )}', key));
                    configPromises.push(symmetricEncrypt('${JSON.stringify(
                      defaultFeatureConfig.sid
                    )}', key));
                    configPromises.push(symmetricEncrypt('${JSON.stringify(
                      defaultFeatureConfig.tess
                    )}', key));

                    Promise.all(configPromises).then((encryptedConfigs) => {
                        const arcFeatureConfig = JSON.stringify(encryptedConfigs[0]);
                        const SIDFeatureConfig = JSON.stringify(encryptedConfigs[1]);
                        const tessFeatureConfig = JSON.stringify(encryptedConfigs[2]);
                        sendMessage(JSON.stringify({publicKey: exportedPublicKey, pk: exportedPrivateKey, taskID: 'accountGen', status: 'success', symkey: jwk, error: null, arcFeatureConfig: arcFeatureConfig, SIDFeatureConfig: SIDFeatureConfig, tessFeatureConfig: tessFeatureConfig}));
                    }).catch(e => {
                       sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: 'failed to encrypt default feature config'}))
                    });
                    



				          }).catch(e => {
                sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: 'failed to export pk'}))
              });
			            }).catch(e => {
                sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: 'failed to export public key'}))
              });
              }).catch(e => {
                sendMessage(JSON.stringify({taskID: 'accountGen', status: 'failed', error: 'failed to gen key pair'}))
              })
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
        
        `;
}

export { genenerateAccountCode };
