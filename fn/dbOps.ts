import * as SQLite from 'expo-sqlite';
import uuid from 'react-native-uuid';


async function createUsersTable() {
    const db = await SQLite.openDatabaseAsync('localCache')
    return await db.runAsync('CREATE TABLE users (id TEXT PRIMARY KEY, signupTime TEXT NOT NULL, publicKey TEXT NOT NULL, passwordHash TEXT, emailAddress TEXT, passkeys TEXT, PIKBackup TEXT NOT NULL, RCKBackup TEXT, trustedDevices TEXT, oauthState TEXT, securityLogs TEXT, featureConfig TEXT NOT NULL);').then(res => {
        return { success: true }
    }).catch(e => {
        throw new Error('oupsie')
    })
}

async function openDB() {
    const db = await SQLite.openDatabaseAsync('localCache')
    // return db.runAsync('INSERT INTO usersx (id, signupTime, publicKey, PIKBackup, featureConfig) VALUES (?, ?, ?, ?, ?)', uuid.v4(), 'a', 'b', 'c', 'd');
    return db.getFirstAsync('SELECT id FROM usersx;');
    // return db.getAllAsync('SELECT * FROM users;');
}

export { openDB, createUsersTable }