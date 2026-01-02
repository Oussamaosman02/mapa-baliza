export function decodeData(e: string, a="K") {
    const i = a.charCodeAt(0)
      , t = atob(e)
      , r = new Uint8Array(t.length);
    for (let o = 0; o < t.length; o++)
        r[o] = t.charCodeAt(o) ^ i;
    return new TextDecoder("utf-8").decode(r)
}