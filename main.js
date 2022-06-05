const hostnameInputEl = document.getElementById('hostname');
const bezeichnungInputEl = document.getElementById('bezeichnung');
const abteilungInputEl = document.getElementById('abteilung');
const betriebssystemInputEl = document.getElementById('betriebssystem');
const lieferdatumInputEl = document.getElementById('lieferdatum');
const submitBtnEl = document.getElementById('form-submit');
const oberflacheRowEl = document.getElementById('oberflache-table');

function getRowIndex(key) {
  switch (key) {
    case '_id':
      return 0;
    case 'hostname':
      return 1;
    case 'bezeichnung':
      return 2;
    case 'abteilung':
      return 3;
    case 'betriebssystem':
      return 4;
    case 'lieferdatum':
      return 5;
    default:
      return null;
  }
}

function getOberflachenFromServer() {
  const url = 'http://localhost:8080/api/get';
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: null,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && Array.isArray(data)) {
        data.forEach((d) => {
          let tr = document.createElement('tr');
          const tds = [];
          for (const key in d) {
            if (Object.hasOwnProperty.call(d, key)) {
              const element = d[key];
              let td = document.createElement('td');
              td.innerHTML = element;
              const elIndex = getRowIndex(key);
              if (elIndex != null && 0 <= elIndex <= 5) {
                tds[elIndex] = td;
              }
            }
          }
          for (const td of tds) {
            tr.appendChild(td);
          }
          oberflacheRowEl.appendChild(tr);
        });
      }
    })
    .catch((err) => console.log(err));
}
getOberflachenFromServer();

submitBtnEl.addEventListener('click', () => {
  const hostname = hostnameInputEl.value;
  const bezeichnung = bezeichnungInputEl.value;
  const abteilung = abteilungInputEl.value;
  const betriebssystem = betriebssystemInputEl.value;
  const lieferdatum = lieferdatumInputEl.value;
  const newOberflache = {
    hostname,
    betriebssystem,
    bezeichnung,
    abteilung,
    lieferdatum,
  };
  const url = 'http://localhost:8080/api/add';
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newOberflache),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});
