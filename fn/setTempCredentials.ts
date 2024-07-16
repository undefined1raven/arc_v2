import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import { createUsersTable } from './dbOps';


type setTempCredentialsArgsType = { symsk: string, pk: string, PIKBackup: string, RCKBackup: string, publicKey: string, featureConfig: string }
type setTempCredentialsReturnType = { error: null | string, errorObj?: object | string, status: 'failed' | 'success' }


async function setTempCredentials(args: setTempCredentialsArgsType): Promise<setTempCredentialsReturnType> {
    SecureStore.setItemAsync('temp-pk', args.pk).catch(e => { return { error: 'Failed to set keychain pk', errorObj: e, status: 'failed' }; });
    SecureStore.setItemAsync('temp-symsk', args.symsk).catch(e => { return { error: 'Failed to set keychain symsk', errorObj: e, status: 'failed' }; });

    const db = await SQLite.openDatabaseAsync('localCache');

    function writeTempUser() {
        db.runAsync('INSERT INTO usersx (id, signupTime, publicKey, PIKBackup, featureConfig) VALUES (?, ?, ?, ?, ?)', 'temp', Date.now().toString(), args.publicKey, args.PIKBackup, args.featureConfig).then(res => {
            return { error: null, status: 'success' };
        }).catch(e => {
            return { error: 'Failed to add user to local cache', errorObj: e, status: 'failed' };
        })
    }

    return db.getFirstAsync('SELECT id FROM users').then(res => {
        return writeTempUser();
    }).catch(async (e) => {
        return createUsersTable().then(res => {
            return writeTempUser();
        }).catch(e => {
            return { error: 'Failed to create users table', errorObj: e, status: 'failed' };
        })

    })
}

export type { setTempCredentialsArgsType, setTempCredentialsReturnType }
export { setTempCredentials }