document.getElementById("search_btn").addEventListener('click', function() {
    alert("검색을 수행합니다!");
    googleSearch(); // 검색 메시지 띄운 후, 구글 검색 수행
});

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정
    if (!searchTerm) {
        alert("검색어를 입력하세요!");
        return;
    }
    
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    
    // 새 창에서 구글 검색 수행
    window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기
}
