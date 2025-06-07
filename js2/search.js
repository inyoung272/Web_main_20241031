document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("search_btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", googlesearch);
  } else {
    console.warn("검색 버튼이 존재하지 않습니다.");
  }
});

function googlesearch() {
  const input = document.querySelector("input[type='search']");
  if (!input || !input.value.trim()) {
    alert("검색어를 입력해주세요.");
    return false;
  }

  const keyword = encodeURIComponent(input.value.trim());
  const url = `https://www.google.com/search?q=${keyword}`;
  window.open(url, '_blank');
  return false;
}
