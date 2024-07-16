import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import { clearTempCredentials } from './clearTempCredentials';
import { createUsersTable } from './dbOps';

type InitializeReturnType = { status: 'success' | 'failed', auth?: boolean, hasCache?: boolean, error?: string };

async function initialize(): Promise<InitializeReturnType> {
    const hasClearedCreds = (await clearTempCredentials()).status === 'success';
    if (!hasClearedCreds) {
        return { status: 'failed', error: 'failed to clear temp creds' };
    } else {
        const db = await SQLite.openDatabaseAsync('localCache')

        return db.getFirstAsync('SELECT id FROM users').then(res => {//check if users table exists
            ///logic for later on
            return { status: 'success', auth: false, hasCache: true };
        }).catch(e => {
            createUsersTable().then(res => {

            }).catch(e => {

            })
        })
    }
}


export { initialize }