import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import { clearTempCredentials } from './clearTempCredentials';
import { createUsersTable } from './dbOps';

type InitializeReturnType = { status: 'success' | 'failed', auth?: boolean, hasCache?: boolean, error?: string, mustCreateNewAccountCreds?: boolean };

async function initialize(): Promise<InitializeReturnType> {
    try {
        clearTempCredentials()
    } catch (e) { }
    const db = await SQLite.openDatabaseAsync('localCache')
    return db.getFirstAsync(`SELECT id FROM users`).then((res: { id: string }) => {//check if users table exists
        if (res !== null) {
            if (res.id !== 'temp') {
                return { status: 'success', auth: false, hasCache: true };
            } else {
                return { status: 'success', mustCreateNewAccountCreds: true }
            }
        } else {
            return { status: 'success', mustCreateNewAccountCreds: true }
        }
    }).catch(async (e) => {
        console.log(e)
        return db.runAsync('CREATE TABLE users (id TEXT PRIMARY KEY, signupTime TEXT NOT NULL, publicKey TEXT NOT NULL, passwordHash TEXT, emailAddress TEXT, passkeys TEXT, PIKBackup TEXT, PSKBackup TEXT, RCKBackup TEXT, trustedDevices TEXT, oauthState TEXT, securityLogs TEXT, featureConfig TEXT NOT NULL);').then(res => {
            return { status: 'success', mustCreateNewAccountCreds: true }
        }).catch(e => {
            return { status: 'failed', error: e }
        })
    })
}

export { initialize }