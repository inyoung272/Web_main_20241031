function show_clock(){
    let currentDate= new Date(); // 현재시스템날짜객체생성
   let divClock= document.getElementById('divClock');
    let msg = "현재시간: ";
    
    if(currentDate.getHours()>12){  // 12시보다크면오후아니면오전
        msg += "오후";
        msg += currentDate.getHours()-12+"시";
    }
    else {
        msg += "오전";
        msg += currentDate.getHours()+"시";
    }
    
    msg += currentDate.getMinutes()+"분";
        msg += currentDate.getSeconds()+"초";
        divClock.innerText= msg;
    
        if (currentDate.getMinutes()>58) {    //정각1분전빨강색출력
        divClock.style.color="red";
    }
    setTimeout(show_clock, 1000);  //1초마다갱신
   }

   function closePopup() {
    if (document.getElementById('check_popup').value) {
    setCookie("popupYN", "N", 1);
    console.log("쿠키를 설정합니다.");
    self.close();
    }
    }
    
    
   function Popup(){
    var cookieCheck = getCookie("popupYN");
    if (cookieCheck != "N"){
    window.open("../popup/popup.html", "팝업테스트", "width=400, height=300, top=10, left=10");
    }
    }

    
function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + ";expires=" + date.toUTCString() + "; path=/";
}

    function getCookie(name) {
        var cookie = document.cookie;
        console.log("쿠키를 요청합니다.");
        if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for ( var index in cookie_array) {
        var cookie_name = cookie_array[index].split("=");
        if (cookie_name[0] == "popupYN") {
        return cookie_name[1];
        }
        }
        }
        return ;
        }
   
   function over(obj) {
    obj.src="../image/logo_steam.svg";
    }
    function out(obj) {
    obj.src="image/steam_blue.png";
    }

//    const over = (obj) => {
//        obj.src = "image/LOGO.png";
//        };
//        const search_message = () => {
//        const c = '검색을 수행합니다';
//        alert(c);
//        };    < 최신 자바 코딩, 위의 function과 동일한 함수다.

