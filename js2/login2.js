// login2.js
import { session_set } from './js_sesion.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT, checkAuth } from './jwt_token.js';

document.addEventListener("DOMContentLoaded", () => {

  checkAuth();         // 로그인 권한 확인
  init_logined();      // 로그인 상태 초기화
  init();              // 쿠키 기반 이메일 불러오기

  // 로그아웃 버튼 이벤트 연결
  const logoutBtn = document.getElementById("logout_btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("Session_Storage_test");
      localStorage.removeItem("jwt_token");
      alert("로그아웃되었습니다.");
      window.location.href = "../index.html";
    });
  }

  // 로그인 버튼
  const loginBtn = document.getElementById("login_btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", check_input);
  }

  // 보안 검사 함수
  function check_xss(input) {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
      alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
      return false;
    }
    return sanitizedInput;
  }

  // 금지어 검사
  function containsBadWords(text) {
    const badWords = ['욕1', '욕2', '욕3'];
    for (let word of badWords) {
      if (text.includes(word)) return true;
    }
    return false;
  }

  // 쿠키 처리 함수
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
    setCookie("login_fail_cnt", count, 0.0035); // 약 5분 유지
    return count;
  }

  function resetLoginFailCount() {
    setCookie("login_fail_cnt", "", -1);
  }

  // 세션 체크
  function session_check() {
    if (sessionStorage.getItem("Session_Storage_test") && !sessionStorage.getItem("loginAlertShown")) {
      alert("이미 로그인 되어 있습니다.");
      sessionStorage.setItem("loginAlertShown", "true");
      location.href = "../login/index_login.html";
    }
  }

  // 로그인 상태 초기화
  function init_logined() {
    if (sessionStorage) {
      decrypt_text();
    } else {
      alert("세션 스토리지를 지원하지 않습니다.");
    }
  }

  function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");

    if (get_id && emailInput) {
      emailInput.value = get_id;
      idsave_check.checked = true;
    }
    session_check();
  }

  // 로그인 처리
  function check_input() {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');

    if (!emailInput || !passwordInput) return;

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    let failCount = parseInt(getCookie("login_fail_cnt") || "0");
    if (failCount >= 5) {
      alert("로그인 5회 이상 실패. 잠시 후 다시 시도해주세요.");
      return false;
    }

    if (emailValue === '' || passwordValue === '') {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      increaseLoginFailCount();
      return false;
    }

    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);
    if (!sanitizedEmail || !sanitizedPassword) {
      increaseLoginFailCount();
      return false;
    }

    if (containsBadWords(emailValue) || containsBadWords(passwordValue)) {
      alert("부적절한 단어가 포함되어 있습니다.");
      increaseLoginFailCount();
      return false;
    }

    if (emailValue.length < 5 || passwordValue.length < 12) {
      alert("아이디 또는 비밀번호가 짧습니다.");
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

    if (idsave_check.checked) {
      setCookie("id", emailValue, 1);
    } else {
      setCookie("id", "", -1);
    }

    const payload = {
      id: emailValue,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const jwtToken = generateJWT(payload);

    session_set();
    sessionStorage.setItem("Session_Storage_test", emailValue);
    localStorage.setItem("jwt_token", jwtToken);
    resetLoginFailCount();

    loginForm.submit();
  }
});
