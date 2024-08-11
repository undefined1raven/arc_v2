import { getInsertStringFromObject } from "./dbUtils";

async function localStorageSet(
  db,
  userID: string,
  key: string,
  value: string
): Promise<{
  error: string | null | object;
  status: "success" | "failed";
}> {
  if (db && userID !== undefined && key !== undefined) {
    const { status, values, queryString } = getInsertStringFromObject({
      userID,
      key,
      value,
    });
    if (status === "success") {
      return db
        .runAsync(`INSERT INTO userData ${queryString}`, values)
        .then((r) => {
          return { error: null, status: "success" };
        })
        .catch((e) => {
          return { error: e, status: "failed" };
        });
    } else {
      return { error: "something went wrong", status: "failed" };
    }
  } else {
    return { error: "invalid input", status: "failed" };
  }
}

async function localStorageGet(
  db,
  userID: string,
  key: string
): Promise<{
  error: string | null | object;
  payload?: null | { activityID: string; tx: Number };
  status: "success" | "failed";
}> {
  if (db?.getFirstAsync && userID !== undefined && key !== undefined) {
    return db
      .getFirstAsync(
        `SELECT * FROM userData WHERE userID='${userID}' AND key='${key}'`
      )
      .then((r) => {
        return { error: null, status: "success", payload: r };
      })
      .catch((e) => {
        return { error: e, status: "failed" };
      });
  } else {
    return { error: "invalid input", status: "failed" };
  }
}

export { localStorageSet, localStorageGet };
