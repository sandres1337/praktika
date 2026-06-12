// получаем элементы со страницы
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const newsContainer = document.getElementById("newsContainer");
const savedContainer = document.getElementById("savedContainer");

// получаем сохранённые новости из localStorage
function getSavedNews() {
  return JSON.parse(localStorage.getItem("savedNews")) || [];
}

// сохраняем новость в localStorage
function saveNews(article) {
  const saved = getSavedNews();
  const alreadySaved = saved.some(item => item.url === article.url);
  if (!alreadySaved) {
    saved.push(article);
    localStorage.setItem("savedNews", JSON.stringify(saved));
  }
  renderSavedNews();
}

// удаляем новость из localStorage
function deleteNews(url) {
  let saved = getSavedNews();
  saved = saved.filter(article => article.url !== url);
  localStorage.setItem("savedNews", JSON.stringify(saved));
  renderSavedNews();
}

// показываем сохранённые новости на странице
function renderSavedNews() {
  const saved = getSavedNews();
  if (saved.length === 0) {
    savedContainer.innerHTML = "No saved news";
    return;
  }
  savedContainer.innerHTML = saved.map(article => `
    <div class="article">
      <h3>${article.title}</h3>
      <p>${article.description || ""}</p>
      <button onclick="deleteNews('${article.url}')">Delete</button>
    </div>
  `).join("");
}

// обработчик кнопки поиска
searchBtn.addEventListener("click", async () => {
  const query = searchInput.value;
  if (!query) {
    newsContainer.innerHTML = "Enter a search word";
    return;
  }
  newsContainer.innerHTML = "Loading...";
  const res = await fetch(`/api/news?q=${query}`);
  const articles = await res.json();
  if (articles.length === 0) {
    newsContainer.innerHTML = "Nothing found";
    return;
  }
  newsContainer.innerHTML = articles.map(article => `
    <div class="article">
      <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
      <p>${article.description || ""}</p>
      <button onclick='saveNews(${JSON.stringify(article)})'>Save</button>
    </div>
  `).join("");
});

// поиск по нажатию Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// при загрузке страницы показываем сохранённые новости
renderSavedNews();