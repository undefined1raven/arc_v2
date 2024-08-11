type getInsertStringFromObjectType = {
  status: "success" | "failed";
  error: string | null | object;
  values?: any[];
  queryString: string;
};

function getInsertStringFromObject(obj: object): {
  status: "success" | "failed";
  error: object | null | string;
  queryString?: string;
  values?: string[];
} {
  if (!obj) return { status: "failed", error: "invalid input" };
  const keys = Object.keys(obj);
  const placeholders = keys.map((_, i) => `?`).join(",");
  return {
    status: "success",
    error: null,
    queryString: `(${keys.join(",")}) VALUES (${placeholders})`,
    values: Object.values(obj),
  };
}

export type { getInsertStringFromObjectType };
export { getInsertStringFromObject };
