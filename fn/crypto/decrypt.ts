function decrypt(symsk: string, payload: string | null) {
  //payload is either JSONstring to be encrypted or encryptedJSONstring containing iv and cipher params
  return `
document.title = "Decryption Worker";
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function ab2strA(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

async function symmetricEncrypt(plaintext, key) {
  let encoded = new TextEncoder().encode(plaintext);
  let iv = window.crypto.getRandomValues(new Uint8Array(12));
  return await window.crypto.subtle
    .encrypt({ name: "AES-GCM", iv: iv }, key, encoded)
    .then((encrypted) => {
      return { cipher: ab2str(encrypted), iv: ab2str(iv) };
    });
}

function stringToArrayBuffer(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
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
    ["encrypt", "decrypt"]
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

async function symmetricDecrypt(key, cipher, iv) {
  return await crypto.subtle
    .decrypt({ name: "AES-GCM", iv: str2ab(iv) }, key, str2ab(cipher))
    .then((decrypted) => {
      return new TextDecoder().decode(decrypted);
    });
}

function sendMessage(message) {
  window.ReactNativeWebView.postMessage(message);
}

function charCodeArrayToString(charCodeArray) {
  let str = '';
  for (let i = 0; i < charCodeArray.length; i++) {
    str += String.fromCharCode(charCodeArray[i]);
  }
  return str;
}


function decode(str) {
  let utf8decoder = new TextDecoder();
  const originalObj = JSON.parse(str);
  const outArray = [];
  const objKeys = Object.keys(originalObj);
  for (let ix = 0; ix < objKeys.length; ix++) {
    outArray.push(originalObj[ix]);
  }
  const uint = new Uint8Array(outArray);
  return utf8decoder.decode(uint);
}
function encode(str) {
  const enc = new TextEncoder().encode(str);
  return JSON.stringify(enc);
}
console.log("[Decryption] string payload present: ", \`${payload}\`);

try {
  if (crypto.subtle !== undefined) {
    const jwk = JSON.parse(\`${symsk}\`);
    const charArray = JSON.parse(\`${payload}\`);
    const {iv, cipher} = JSON.parse(charCodeArrayToString(charArray));
    importSymmetricKey(jwk)
      .then((key) => {
        symmetricDecrypt(key, cipher, iv)
          .then((decrypted) => {
            sendMessage(
              JSON.stringify({
                taskID: "dataDecryption",
                error: null,
                status: "success",
                payload: decrypted,
              })
            );
          })
          .catch((e) => {
            sendMessage(
              JSON.stringify({
                taskID: "dataDecryption1",
                error: "Decryption failed",
                status: "failed",
              })
            );
          });
      })
      .catch((e) => {
        sendMessage(
          JSON.stringify({
            taskID: "dataDecryption1",
            error: "Key import failed",
            status: "failed",
          })
        );
      });
  } else {
    sendMessage(
      JSON.stringify({
        taskID: "dataDecryption2",
        error: "Subtle Crypto INOP",
        status: "failed",
      })
    );
  }
} catch (e) {
  sendMessage(
    JSON.stringify({
      taskID: "dataDecryption3",
      error: e,
      status: "failed",
    })
  );
}
`;
}

export { decrypt };
