import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import { createUsersTable } from './dbOps';


type setTempCredentialsArgsType = { symsk: string, pk: string, PIKBackup: string, RCKBackup: string, publicKey: string, featureConfig: string }
type setTempCredentialsReturnType = { error: null | string, errorObj?: object | string, status: 'failed' | 'success' }


async function setTempCredentials(args: setTempCredentialsArgsType): Promise<setTempCredentialsReturnType> {
    SecureStore.setItemAsync('temp-pk', args.pk).catch(e => { return { error: 'Failed to set keychain pk', errorObj: e, status: 'failed' }; });
    SecureStore.setItemAsync('temp-symsk', args.symsk).catch(e => { return { error: 'Failed to set keychain symsk', errorObj: e, status: 'failed' }; });

    const db = await SQLite.openDatabaseAsync('localCache');

    return db.runAsync('INSERT INTO users (id, signupTime, publicKey, PIKBackup, featureConfig) VALUES (?, ?, ?, ?, ?)', 'temp', Date.now().toString(), args.publicKey, args.PIKBackup, args.featureConfig).then(res => {
        console.log(res)
        return { error: null, status: 'success' };
    }).catch(e => {
        return { error: 'Failed to add user to local cache', errorObj: e, status: 'failed' };
    })
}

export type { setTempCredentialsArgsType, setTempCredentialsReturnType }
export { setTempCredentials }