import { session_set } from './js_sesion.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT, checkAuth } from './jwt_token.js';

document.addEventListener("DOMContentLoaded", () => {

  checkAuth();         // 로그인 권한 확인
  init_logined();      // 로그인 상태 초기화
  init();              // 쿠키 기반 이메일 불러오기

  // 로그아웃 버튼
  const logoutBtn = document.getElementById("logout_btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // 로그인 버튼
  const loginBtn = document.getElementById("login_btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", check_input);
  }

  // ==== 🔒 보안 관련 유틸 함수 ====

  function check_xss(input) {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
      alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
      return false;
    }
    return sanitizedInput;
  }

  function containsBadWords(text) {
    const badWords = ['욕1', '욕2', '욕3']; // 금지어 목록 수정 가능
    for (let word of badWords) {
      if (text.includes(word)) return true;
    }
    return false;
  }

  // ==== 🍪 쿠키 유틸 함수 ====

  function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + ";expires=" + date.toUTCString() + "; path=/";
  }

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === decodeURIComponent(name)) return decodeURIComponent(value);
    }
    return null;
  }

  function increaseLoginFailCount() {
    let count = parseInt(getCookie("login_fail_cnt") || "0");
    count += 1;
    setCookie("login_fail_cnt", count, 0.0035); // 약 5분 (5/1440일)
    return count;
  }

  function resetLoginFailCount() {
    setCookie("login_fail_cnt", "", -1);
  }

  // ==== 🚪 세션 체크 및 초기화 ====

  function session_check() {
    if (sessionStorage.getItem("Session_Storage_test") && !sessionStorage.getItem("loginAlertShown")) {
      alert("이미 로그인 되어 있습니다.");
      sessionStorage.setItem("loginAlertShown", "true");
      location.href = "../login/index_login.html";
    }
  }

  function init_logined() {
    if (sessionStorage) {
      decrypt_text(); // 복호화 함수
    } else {
      alert("세션 스토리지를 지원하지 않는 브라우저입니다.");
    }
  }

  function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");

    if (get_id) {
      emailInput.value = get_id;
      idsave_check.checked = true;
    }
    session_check();
  }

  // ==== 🔐 로그인 처리 ====

  function check_input() {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // 실패 횟수 확인
    let failCount = parseInt(getCookie("login_fail_cnt") || "0");
    if (failCount >= 5) {
      alert("로그인 5회 이상 실패. 잠시 후 다시 시도해주세요.");
      return false;
    }

    // 필수 입력값 확인
    if (emailValue === '' || passwordValue === '') {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      increaseLoginFailCount();
      return false;
    }

    // XSS 검사
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);
    if (!sanitizedEmail || !sanitizedPassword) {
      increaseLoginFailCount();
      return false;
    }

    // 금지어 검사
    if (containsBadWords(emailValue) || containsBadWords(passwordValue)) {
      alert("부적절한 단어가 포함되어 있습니다.");
      increaseLoginFailCount();
      return false;
    }

    // 유효성 검사
    if (emailValue.length < 5) {
      alert('아이디는 최소 5글자 이상 입력해야 합니다.');
      increaseLoginFailCount();
      return false;
    }

    if (passwordValue.length < 12) {
      alert('비밀번호는 12자 이상 입력해야 합니다.');
      increaseLoginFailCount();
      return false;
    }

    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);

    if (!hasSpecialChar || !hasUpperCase || !hasLowerCase) {
      alert('비밀번호는 특수문자, 대소문자를 포함해야 합니다.');
      increaseLoginFailCount();
      return false;
    }

    // ID 저장 여부 쿠키 처리
    if (idsave_check.checked) {
      setCookie("id", emailValue, 1);
    } else {
      setCookie("id", "", -1);
    }

    // JWT 생성 및 저장
    const payload = {
      id: emailValue,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const jwtToken = generateJWT(payload);

    // 로그인 성공 처리
    session_set(); // 세션 생성
    sessionStorage.setItem("Session_Storage_test", emailValue);
    localStorage.setItem('jwt_token', jwtToken);
    resetLoginFailCount(); // 실패 카운트 초기화

    loginForm.submit();
  }

  // ==== 🚪 로그아웃 처리 ====

  function logout() {
    if (sessionStorage.getItem("Session_Storage_test")) {
      sessionStorage.removeItem("Session_Storage_test");
      localStorage.removeItem("jwt_token");
      alert("로그아웃되었습니다.");
      location.href = "../index.html";
    } else {
      alert("로그인 상태가 아닙니다.");
    }
  }
});
