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
  
  init();
  
  const check_input = () => {
  const loginForm = document.getElementById('login_form');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');
  const idsave_check = document.getElementById('idSaveCheck');

  const emailValue = emailInput.value.trim();
const passwordValue = passwordInput.value.trim();

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

sessionStorage.setItem("Session_Storage_test", emailValue);
loginForm.submit();

};

document.getElementById("login_btn").addEventListener('click', check_input);
});

