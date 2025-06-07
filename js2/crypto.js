import { session_set, session_set2, session_get, session_check } from './js_sesion.js';

// AES256 암호화 함수
function encodeByAES256(key, data) {
  const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(""),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  return cipher.toString();
}

// AES256 복호화 함수
function decodeByAES256(key, data) {
  if (!data) {
    throw new Error("복호화할 데이터가 없습니다.");
  }

  const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(""),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  return cipher.toString(CryptoJS.enc.Utf8);
}

export function encrypt_text(password) {
  const k = "key";
  const rk = k.padEnd(32, " ");
  const b = password;
  const eb = encodeByAES256(rk, b);
  console.log("암호화 결과:", eb);
  return eb;
}

export function decrypt_text() {
  const k = "key";
  const rk = k.padEnd(32, " ");
  const eb = session_get();

  if (!eb) {
    console.error("session_get()의 반환값이 비어 있음");
    return;
  }

  try {
    const b = decodeByAES256(rk, eb);
    console.log("복호화 결과:", b);
    return b;
  } catch (e) {
    console.error("복호화 실패:", e.message);
  }
}
