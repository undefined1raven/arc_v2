import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';



type setTempCredentialsReturnType = { error: null | string, errorObj?: object | string, status: 'failed' | 'success' }

async function clearTempCredentials(): Promise<setTempCredentialsReturnType> {
    await SecureStore.deleteItemAsync('temp-pk').catch(e => { return { error: 'Failed to delete keychain pk', errorObj: e, status: 'failed' }; });;
    await SecureStore.deleteItemAsync('temp-symsk').catch(e => { return { error: 'Failed to delete keychain symsk', errorObj: e, status: 'failed' }; });
    const db = await SQLite.openDatabaseAsync('localCache')
    await db.runAsync(`DELETE FROM users WHERE id='temp'`).catch(e => { return { error: 'Failed to delete temp user creds', errorObj: e, status: 'failed' }; });
    return { error: null, status: 'success' };
}


export { clearTempCredentials }