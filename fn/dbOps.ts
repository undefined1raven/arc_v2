import * as SQLite from 'expo-sqlite';
import uuid from 'react-native-uuid';

async function openDB() {
    const db = await SQLite.openDatabaseAsync('localCache')
    // return db.runAsync('CREATE TABLE users (id TEXT PRIMARY KEY, signupTime TEXT NOT NULL, publicKey TEXT NOT NULL, passwordHash TEXT, emailAddress TEXT, passkeys TEXT, PIKBackup TEXT NOT NULL, RCKBackup TEXT, trustedDevices TEXT, oauthState TEXT, securityLogs TEXT, featureConfig TEXT NOT NULL);');
    // return db.runAsync('INSERT INTO users (id, signupTime, publicKey, PIKBackup, featureConfig) VALUES (?, ?, ?, ?, ?)', uuid.v4(), 'a', 'b', 'c', 'd');
    return db.getAllAsync('SELECT * FROM users;');
}

export { openDB }