const urlParams = new URLSearchParams(window.location.search);
const categoryName = urlParams.get('name');
document.getElementById('category-title').textContent = categoryName.toUpperCase();

// Subcategories for sports
const subcategories = {
  sports: [
    { name: "Hockey", link: "./category.html?name=hockey" },
    { name: "Football", link: "./category.html?name=football" }
  ],
  hockey: [
    { name: "NHL", link: "./nhl.html" }
  ]
};

const links = subcategories[categoryName] || [];
const list = document.getElementById('category-links');
links.forEach((subcategory) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = subcategory.link;
  a.textContent = subcategory.name;
  li.appendChild(a);
  list.appendChild(li);
});
