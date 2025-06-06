document.document.getElementById("search_button_msg").addEventListener('click', search_message);

function search_message(){
    let msg = "검색을 수행합니다";
    alert(msg);
}


function googleSearch() {
    const searchTerm = document.getElementById("search_input").value.trim();

    // 1. 공백 검사
    if (searchTerm.length === 0) {
        alert("검색어를 입력해주세요.");
        return false;
    }

    // 2. 비속어 필터링
    const badWords = ["바보", "멍청이", "죽어", "꺼져", "망할"];  // 필터링할 단어 목록
    for (let i = 0; i < badWords.length; i++) {
        if (searchTerm.includes(badWords[i])) {
            alert("부적절한 단어가 포함되어 있습니다.");
            return false;
        }
    }

    // 3. 검색 실행
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}
