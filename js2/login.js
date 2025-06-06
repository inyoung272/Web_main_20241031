import { session_set, session_get, session_check } from './js_sesion.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT, checkAuth } from './jwt_token.js';

document.addEventListener("DOMContentLoaded", () => {

  const check_xss = (input) => {
  const DOMPurify = window.DOMPurify;
  const sanitizedInput = DOMPurify.sanitize(input);
  if (sanitizedInput !== input) {
  alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
  return false;
  }
  return sanitizedInput;
  };
  
  function setCookie(name, value, expiredays) {
  const date = new Date();
  date.setDate(date.getDate() + expiredays);
  document.cookie = escape(name) + "=" + escape(value) + ";expires=" + date.toUTCString() + "; path=/";
  }
  
  function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
  const [key, value] = cookie.split("=");
  if (key === name) return value;
  }
  return null;
  }
  
  function session_check() {
  if (sessionStorage.getItem("Session_Storage_test")) {
  alert("이미 로그인 되었습니다.");
  location.href = "../login/index_login.html";
  }
  }

  function session_del() {//세션 삭제
if (sessionStorage) {
sessionStorage.removeItem("Session_Storage_test");
 alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
 } else {
 alert("세션 스토리지 지원 x");
 }
 }

function logout(){
 session_del(); // 세션 삭제
location.href='../index.html';
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

  

  document.addEventListener('DOMContentLoaded', () => {
init();
});


  function init_logined(){
if(sessionStorage){
decrypt_text(); // 복호화 함수
}
else{
alert("세션 스토리지 지원 x");
}
}
  
  init();
  
  const check_input = () => {
  const loginForm = document.getElementById('login_form');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');
  const idsave_check = document.getElementById('idSaveCheck');

  const emailValue = emailInput.value.trim();
const passwordValue = passwordInput.value.trim();

      const payload = {
    id: emailValue,
    exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
    };
    const jwtToken = generateJWT(payload);



if (emailValue === '' || passwordValue === '') {
  alert("아이디와 비밀번호를 모두 입력해주세요.");
  return false;
}

const sanitizedEmail = check_xss(emailValue);
const sanitizedPassword = check_xss(passwordValue);
if (!sanitizedEmail || !sanitizedPassword) return false;

if (emailValue.length < 5) {
  alert('아이디는 최소 5글자 이상 입력해야 합니다.');
  return false;
}

if (passwordValue.length < 12) {
  alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
  return false;
}

const hasSpecialChar = /[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordValue);
if (!hasSpecialChar) {
  alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
  return false;
}

const hasUpperCase = /[A-Z]/.test(passwordValue);
const hasLowerCase = /[a-z]/.test(passwordValue);
if (!hasUpperCase || !hasLowerCase) {
  alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
  return false;
}

if (idsave_check.checked) {
  setCookie("id", emailValue, 1);
} else {
  setCookie("id", emailValue, 0);
}

  console.log('이메일:', emailValue);
  console.log('비밀번호:', passwordValue);
  session_set(); // 세션 생성
  sessionStorage.setItem("Session_Storage_test", emailValue);
  localStorage.setItem('jwt_token', jwtToken);
  loginForm.submit();

  };

document.getElementById("login_btn").addEventListener('click', check_input);
});

function login_failed() {
  let failCount = parseInt(getCookie("failCount") || "0");

  failCount += 1;
  setCookie("failCount", failCount, 1);  // 하루 유지

  const failMessage = document.getElementById("fail_message");

  if (failCount >= 3) {
    alert("로그인 실패가 3회 초과되어 제한됩니다.");
    if (failMessage) {
      failMessage.innerText = `로그인 제한: ${failCount}회 실패`;
    }
    // 버튼 비활성화
    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) {
      loginBtn.disabled = true;
    }
    return false;
  } else {
    alert(`로그인 실패! 현재 실패 횟수: ${failCount}`);
    if (failMessage) {
      failMessage.innerText = `현재 실패 횟수: ${failCount}`;
    }
  }
}
