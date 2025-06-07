import { encrypt_text, decrypt_text } from './crypto.js';

export function session_set() {
    let id = document.querySelector("#typeEmailX");
    let password = document.querySelector("#typePasswordX");
    let random = new Date(); 
    const obj = { 
        id: id.value,
        otp: random
    };

    const objString = JSON.stringify(obj);
    let en_text = encrypt_text(objString);
    sessionStorage.setItem("Session_Storage_id", id.value);
    sessionStorage.setItem("Session_Storage_object", objString);
    sessionStorage.setItem("Session_Storage_pass", en_text);
}

// 회원가입 시 암호화된 객체 저장
export function session_set2(signupObj) {
    const objString = JSON.stringify(signupObj);
    const encrypted = encrypt_text(objString);
    sessionStorage.setItem("signup_data_encrypted", encrypted);
}

// 로그인 시 복호화된 객체 출력
export function get_signup_data() {
    const encrypted = sessionStorage.getItem("signup_data_encrypted");
    if (!encrypted) {
        console.warn("세션에 암호화된 회원가입 데이터가 없습니다.");
        return null;
    }

    try {
        const decrypted = decrypt_text(encrypted);  // 복호화
        console.log("복호화된 회원가입 데이터:", decrypted);
        return JSON.parse(decrypted);
    } catch (e) {
        console.error("복호화 실패:", e.message);
        return null;
    }
}

export function session_get() {
    // 세션에서 데이터를 꺼내오는 것에만 집중하도록 수정
    const id = sessionStorage.getItem("Session_Storage_id");
    const objectData = sessionStorage.getItem("Session_Storage_object");
    const encrypted = sessionStorage.getItem("Session_Storage_pass");

    if (id && objectData && encrypted) {
        console.log("세션에서 데이터 로드 완료:", id, objectData);
    } else {
        alert("세션 데이터가 존재하지 않습니다.");
    }
}

export function session_check() {
    if (sessionStorage.getItem("Session_Storage_id")) {
        alert("이미 로그인 되었습니다.");
        location.href = '../login/index_login.html';
    }
}

function session_del() {
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function logout() {
    session_del(); 
    location.href = '../index.html';
}
