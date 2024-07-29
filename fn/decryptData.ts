


function decryptData(encryptedObj: { iv: string, cipher: string }, symsk: string) {
    return `

    function sendMessage(message) {
    window.ReactNativeWebView.postMessage(message)
} 

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
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


async function symmetricDecrypt(cipher, key, iv) {
    return await crypto.subtle.decrypt({ name: 'AES-GCM', iv: str2ab(iv) }, key, str2ab(cipher)).then((decrypted) => {
        return new TextDecoder().decode(decrypted);
    });
}

if(crypto === undefined || crypto?.subtle === undefined){
    sendMessage(JSON.stringify({ taskID: 'dataDecryption', error: 'Crypto Ops INOP', status: 'failed' }));
}else{
    const symsk = '${symsk}';
    try{
        const jwk = JSON.parse('${symsk}');
        const iv = \`${encryptedObj.iv}\`;
        const cipher = \`${encryptedObj.cipher}\`;
        importSymmetricKey(jwk).then(key => {
            symmetricDecrypt(cipher, key, iv).then(res => {
                sendMessage(JSON.stringify({ taskID: 'dataDecryption', error: null, status: 'success', paylaod: JSON.stringify(res) }));
            }).catch(e => {
                sendMessage(JSON.stringify({ taskID: 'dataDecryption', error: e, status: 'failed' }));
            })
        }).catch(e => {
            sendMessage(JSON.stringify({ taskID: 'dataDecryption', error: e, status: 'failed' }));
        })
    }catch(e){
        sendMessage(JSON.stringify({ taskID: 'dataDecryption', error: e, status: 'failed' }));
    }
}
          `
}


export { decryptData }