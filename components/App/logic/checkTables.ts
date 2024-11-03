import * as SQLite from "expo-sqlite";

type CheckTablesReturnSig = {
  status: "failed" | "success";
  error: null | string;
  isEmpty?: boolean;
};

async function checkTablesActual(): Promise<CheckTablesReturnSig> {
  const db = await SQLite.openDatabaseAsync("localCache");
  var promiseArray: Promise<any>[] = [];
  const usersTablePromise = db.runAsync(
    "CREATE TABLE IF NOT EXISTS users (id TEXT NOT NULL PRIMARY KEY, signupTime NUMBER NOT NULL, publicKey TEXT NOT NULL, passwordHash TEXT, emailAddress TEXT, passkeys TEXT, PIKBackup TEXT, PSKBackup TEXT, RCKBackup TEXT, trustedDevices TEXT, oauthState TEXT, securityLogs TEXT, arcFeatureConfig TEXT NOT NULL, SIDFeatureConfig TEXT NOT NULL, tessFeatureConfig TEXT NOT NULL, version TEXT NOT NULL);"
  );
  promiseArray.push(usersTablePromise);
  const userDataTablePromise = db.runAsync(
    "CREATE TABLE IF NOT EXISTS userData (userID TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, version TEXT NOT NULL, PRIMARY KEY (userID, key));"
  );
  promiseArray.push(userDataTablePromise);
  const arcChunksTablePromise = db.runAsync(
    "CREATE TABLE IF NOT EXISTS arcChunks (id TEXT NOT NULL PRIMARY KEY, userID TEXT NOT NULL, encryptedContent TEXT NOT NULL, tx NUMBER NOT NULL, version TEXT NOT NULL);"
  );
  promiseArray.push(arcChunksTablePromise);
  const tessChunksTablePromise = db.runAsync(
    "CREATE TABLE IF NOT EXISTS tessChunks (id TEXT NOT NULL PRIMARY KEY, userID TEXT NOT NULL, encryptedContent TEXT NOT NULL, tx NUMBER NOT NULL, version TEXT NOT NULL);"
  );
  promiseArray.push(tessChunksTablePromise);
  const SIDChunksTablePromise = db.runAsync(
    "CREATE TABLE IF NOT EXISTS sidChunks (id TEXT NOT NULL PRIMARY KEY, userID TEXT NOT NULL, encryptedContent TEXT NOT NULL, tx NUMBER NOT NULL, version TEXT NOT NULL);"
  );
  promiseArray.push(SIDChunksTablePromise);
  const SIDGruopsChunksTablePromise = db.runAsync(
    "CREATE TABLE IF NOT EXISTS sidGroups (id TEXT NOT NULL PRIMARY KEY, userID TEXT NOT NULL, encryptedContent TEXT NOT NULL, tx NUMBER NOT NULL, version TEXT NOT NULL);"
  );
  promiseArray.push(SIDGruopsChunksTablePromise);
  return Promise.all(promiseArray)
    .then(() => {
      return db
        .getFirstAsync("SELECT id FROM users;")
        .then((firstUser) => {
          const isEmpty = firstUser === null;
          return { status: "success", error: null, isEmpty: isEmpty };
        })
        .catch((e) => {
          throw e;
        });
    })
    .catch((e) => {
      throw e;
    });
}

async function checkTables(): Promise<CheckTablesReturnSig> {
  const db = await SQLite.openDatabaseAsync("localCache");
  // db.runAsync("DROP TABLE users");
  // db.runAsync("DROP TABLE userData");
  // db.runAsync("DROP TABLE arcChunks");
  // db.runAsync("DROP TABLE tessChunks");
  // db.runAsync("DROP TABLE sidChunks");
  // db.runAsync("DROP TABLE sidGroups");

  return checkTablesActual() //do some manual recursion since for some reason creating the tables doens't work the first time (after a fresh install)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return checkTablesActual()
        .then((res) => {
          return res;
        })
        .catch((e) => {
          return { status: "failed", error: e };
        });
    });
}

export { checkTables };
