import { FParseMixedParam } from "./functions";
import { Stream } from "./objects";

export function isNumber(value: unknown): boolean {
  if (typeof value === "undefined") return false;
  if (value === null) return false;
  if (("" + value).includes("x")) return false;

  return !isNaN(Number("" + value));
}

export function parseMixedParam({
  values,
  stringKey,
  numericKey,
}: FParseMixedParam): string {
  let query = "";

  function addToQuery(value: string | number): void {
    const key = !isNumber(value) ? stringKey : numericKey;

    query += `${key}=${value}`;
  }

  if (Array.isArray(values)) values.forEach(addToQuery);
  else addToQuery(values);

  return query.replace(/&$/, "");
}

export function parseOptions<T>(options: T): string {
  let query = "";

  for (const key in options) {
    const value = options[key];

    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) query += parseArrayToQueryString(key, value);
    else query += `${key}=${value}&`;
  }

  return query.replace(/&$/, "");
}

export function parseArrayToQueryString(
  key: string,
  arr: readonly unknown[]
): string {
  const list = Array.isArray(arr) ? arr : [arr];
  const result = list.map((value) => `${key}=${value}`).join("&");

  return result;
}

export function addThumbnailMethod(stream: Stream): Stream {
  const thumbnailUrl = stream.thumbnail_url;
  stream.getThumbnailUrl = (
    options: { width: number; height: number } = { width: 1920, height: 1080 }
  ) => {
    const { width, height } = options;
    return thumbnailUrl
      .replace("{width}", "" + width)
      .replace("{height}", "" + height);
  };

  return stream;
}
