let allUsers = [];
let usersSearchList = [];

let divFilteredUsers = null;
let divStatistics = null;
let inputFilterText = null;

let numberFormat = null;

window.addEventListener('load', () => {
  divFilteredUsers = document.querySelector('#div-filtered-users');
  divStatistics = document.querySelector('#div-statistics');
  inputFilterText = document.querySelector('#input-filter-text');

  numberFormat = Intl.NumberFormat('pt-BR');

  doFecthUsers();
});

async function doFecthUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();

  allUsers = json.results.map((user) => {
    const { gender, name, dob, picture } = user;
    return {
      gender: gender,
      name: name.first + ' ' + name.last,
      age: dob.age,
      picture: picture.thumbnail,
    };
  });
  render();
}

function render() {
  doFilter(inputFilterText.value);
  renderUsersSearchList();
  renderStatistics();
  handleSearch();
}

function doFilter(text) {
  if (text.trim().length === 0) {
    usersSearchList = allUsers;
    sort();
    return;
  }

  usersSearchList = allUsers.filter((user) => {
    if (user.name.toUpperCase().indexOf(text.toUpperCase()) >= 0) {
      return true;
    } else {
      return false;
    }
  });

  sort();
  console.log(usersSearchList);
}

function renderUsersSearchList() {
  let usersHTML = `<div>
  <h1>${usersSearchList.length} usuário(s) encontrado(s)</h1>`;
  usersSearchList.forEach((user) => {
    const { name, age, picture } = user;
    const userHTML = `
      <div class = 'users-list'>
      <div>
      <img src="${picture}" alt="${name}">
      </div>
      <div>
      <p>${name}, ${age} anos</p>
      </div>
      </div>
      `;
    usersHTML += userHTML;
  });
  usersHTML += '</div>';
  divFilteredUsers.innerHTML = usersHTML;
}

function renderStatistics() {
  let countFemale = 0;
  let countMale = 0;
  let sumTotalAges = 0;
  let averageOfAges = 0;

  doCount();

  divStatistics.innerHTML = `
  <div>
    <h1>Estatísticas</h1>
    <div>
      <p>Sexo masculino: ${countMale}</p>
      <p>Sexo feminino: ${countFemale}</p>
      <p>Soma das idades: ${sumTotalAges}</p>
      <p>Média das idades: ${formatNumber(averageOfAges)}</p>
    </div>
  </div>`;

  function doCount() {
    countFemale = usersSearchList.reduce((accumulator, current) => {
      return accumulator + (current.gender === 'female' ? 1 : 0);
    }, 0);

    countMale = usersSearchList.reduce((accumulator, current) => {
      return accumulator + (current.gender === 'male' ? 1 : 0);
    }, 0);

    sumTotalAges = usersSearchList.reduce((accumulator, current) => {
      return accumulator + current.age;
    }, 0);

    averageOfAges = sumTotalAges / usersSearchList.length;
  }
}

function handleSearch() {
  const searchButton = document.querySelector('#button-filter');

  searchButton.addEventListener('click', () => {
    render();
  });

  inputFilterText.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      render();
    }
  });
}

function sort() {
  usersSearchList.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

function formatNumber(number) {
  return numberFormat.format(number);
}
