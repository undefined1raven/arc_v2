import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import { clearTempCredentials } from './clearTempCredentials';
import { createUsersTable } from './dbOps';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/app/store';
import { updateLocalUserIDs } from '@/hooks/localUserIDs';
type InitializeReturnType = { status: 'success' | 'failed', auth?: boolean, hasCache?: boolean, error?: string, mustCreateNewAccountCreds?: boolean, allowedAyncGen?: boolean };

async function initialize(): Promise<InitializeReturnType> {
    var tx = Date.now()

    function profile(label) {
        console.log((Date.now() - tx).toString() + ' | ', label);
        tx = Date.now()
    }
    profile('ini called');

    const db = await SQLite.openDatabaseAsync('localCache')

    profile('db link established');

    SecureStore.deleteItemAsync('temp-pk').catch(e => { return { error: 'Failed to delete keychain pk', errorObj: e, status: 'failed' }; });;
    SecureStore.deleteItemAsync('temp-symsk').catch(e => { return { error: 'Failed to delete keychain symsk', errorObj: e, status: 'failed' }; });


    return db.getFirstAsync(`SELECT id FROM users`).then(async (res: { id: string }) => {//check if users table exists
        profile('asssess #1');
        if (res !== null) {
            const usersInCache: { id: string }[] = await db.getAllAsync(`SELECT id FROM users`);
            const localUserIDsArray: { authenticated: boolean, id: string }[] = [];
            for (let ix = 0; ix < usersInCache.length; ix++) {
                const userID = usersInCache[ix].id;
                if (usersInCache[ix].id !== 'temp') {
                    const isLocalUser = userID.split('.').length === 2;//local accounts have .local in their id 
                    const userPrivateKey = await SecureStore.getItemAsync(`${userID}-pk`);
                    const userSymsk = await SecureStore.getItemAsync(`${userID}-symsk`);
                    if (userPrivateKey !== null && userSymsk !== null) {
                        if (isLocalUser) {
                            console.log('hh')
                            localUserIDsArray.push({ authenticated: true, id: userID });
                        } else {
                            ///backend auth check first
                        }
                    }
                } else {
                    await db.runAsync(`DELETE FROM users WHERE id='temp'`).catch(e => { });
                    profile('delete temp from users');
                    return { status: 'success', mustCreateNewAccountCreds: true, allowedAyncGen: true }
                }
            }
            store.dispatch(updateLocalUserIDs(localUserIDsArray));
            return { status: 'success', auth: true, hasCache: true };
        } else {
            return { status: 'success', mustCreateNewAccountCreds: true, allowedAyncGen: true }
        }
    }).catch(async (e) => {
        profile('asssess #2');
        console.log(e)
        return db.runAsync('CREATE TABLE users (id TEXT PRIMARY KEY, signupTime TEXT NOT NULL, publicKey TEXT NOT NULL, passwordHash TEXT, emailAddress TEXT, passkeys TEXT, PIKBackup TEXT, PSKBackup TEXT, RCKBackup TEXT, trustedDevices TEXT, oauthState TEXT, securityLogs TEXT, featureConfig TEXT NOT NULL, version TEXT NOT NULL);').then(res => {
            return { status: 'success', mustCreateNewAccountCreds: true, allowedAyncGen: true }
        }).catch(e => {
            return { status: 'failed', error: e }
        })
    })
}
export type { InitializeReturnType }
export { initialize }