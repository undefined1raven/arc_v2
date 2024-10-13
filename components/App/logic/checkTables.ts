import * as SQLite from "expo-sqlite";

type CheckTablesReturnSig = {
  status: "failed" | "success";
  error: null | string;
  isEmpty?: boolean;
};

async function checkTables(): Promise<CheckTablesReturnSig> {
  const db = await SQLite.openDatabaseAsync("localCache");
  // db.runAsync("DROP TABLE users");
  // db.runAsync("DROP TABLE userData");
  // db.runAsync("DROP TABLE arcChunks");
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
  return db
    .getFirstAsync("SELECT id FROM users;")
    .then((firstUser) => {
      const isEmpty = firstUser === null;
      return Promise.all(promiseArray)
        .then((res) => {
          return { status: "success", error: null, isEmpty: isEmpty };
        })
        .catch((e) => {
          console.log(e, "fmx");
          return { status: "failed", error: e };
        });
    })
    .catch((e) => {
      console.log(e, "fmx");
      return { status: "failed", error: e };
    });
}

export { checkTables };
