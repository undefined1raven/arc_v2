import * as SecureStore from 'expo-secure-store';

type InitializeReturnType = { status: 'success' | 'error', auth: boolean, hasCache: boolean, error?: string };

async function initialize(): Promise<InitializeReturnType> {
    const privateKey = await SecureStore.getItemAsync('privateKey');
    const sessionID = await SecureStore.getItemAsync("sid");
    const sessionToken = await SecureStore.getItemAsync("sek");
    const uids = await SecureStore.getItemAsync('uids');

    if (privateKey === null || sessionID === null || sessionToken === null || uids === null) {
        return { status: 'error', auth: false, hasCache: false, error: 'Missing value in keychain' };
    } else {
        
    }
}


export { initialize }