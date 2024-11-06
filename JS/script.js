function createCardHTML(book) {
    return `
   <div class="col-sm-12 col-md-6 col-lg-4 mb-4">
       <div class="card h-100 shadow">
           <img src="${book.copertina}" class="card-img-top img-fluid" alt="copertina di ${book.titolo}">
           <div class="card-body d-flex flex-column">
               <div class="mt-auto">
                   <h5 class="card-title">${book.titolo}</h5>
                   <p class="card-text">${book.autore} - ${book.anno}</p>
                   <p class="card-text">Genere: ${book.genere}</p>
                   <p class="card-text">Prezzo: $${book.prezzo.toFixed(2)}</p>
                   <p class="card-text">Disponibilità: ${book.disponibilita ? 'Disponibile' : 'Non disponibile'}</p>               
               </div>
               <button onclick="openEditModal(${book.id})" class="btn btn-primary m-1">Modifica</button>
               <button onclick="deleteBook(${book.id})" class="btn btn-danger m-1">Elimina</button>           
           </div>
       </div>
   </div>
   `;
}

document.addEventListener('DOMContentLoaded', function (){

    const storedData = localStorage.getItem('BooksData');
    let data = storedData ? JSON.parse(storedData) : JSON.parse(JSONData);

    const container = document.getElementById('cards-container');
    if(!container) {
        console.error('Container element not found');
        return;
    }

    if(!Array.isArray(data) || !data.length) {
        console.log('No books data available');
        return;
    }

    let allCardsHTML = data.map(book => {
        if(!book.copertina || !book.title || !book.autore) {
            console.log('book data in  incomplete', book);
            return '';
        }
        return createCardHTML(book);
    }).join('');

    container.insertAdjacentHTML('beforeend', allCardsHTML);

    createGenreSwitches(data);
});
//-------------------------------------------------------------------------------------------

function filterByProperty(propertyName, value) {
    if(!Array.isArray(data)){
        console.error('Invalid data: expected an array of books');
        return;
    }
    const filteredData = data.filter(book => book[propertyName] && book[propertyName] === value);
    displayBooks(filteredData);
}

//--------------------------------------------------------------------------------------------

function displayBooks(filteredData) {
    console.log(filteredData);
    const container = document.getElementById('cards-container');

    container.innerHTML = "";
    filteredData.forEach(book => {
        const htmlContent = createCardHTML(book);
        container.insertAdjacentHTML('beforeend', htmlContent);
    })
}
//------------------------------------------------------------------------------------------------

let debounceTimeout;

function searchBooks() {
    const searchBox = document.getElementById('searchBox');
    if(!searchBox){
        console.error('Search box element non found');
        return;
    }
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() =>{
        const searchTerm = searchBox.value.trim().toLowerCase();
        let filteredData;
        if(searchTerm) {
            filteredData =  data.filter(book =>
                book.titolo.toLowerCase().includes(searchTerm) ||
                book.autore.toLowerCase().includes(searchTerm)
            );
        }else {
            filteredData = data;
        }
        displayBooks(filteredData);
    }, 300);
}
//--------------------------------------------------------------------------------------------------

function openEditModal(bookId) {
    const book = data.find(b =>b.id === bookId)
}




