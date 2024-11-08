'use strict'


function createCardHTML(book) {
    return `
    <div class="col-sm-12 col-md-6 col-lg-4 mb-4">
    <div class="card h-100 shadow">
        <img src="${book.copertina}" class="card-img-top img-fluid" alt="Copertina di ${book.titolo}">
        <div class="card-body d-flex flex-column">
            <div class="mt-auto">
                <h5 class="card-title">${book.titolo}</h5>
                <p class="card-text">${book.autore} - ${book.anno}</p>
                <p class="card-text">Genere: ${book.genere}</p>
                <p class="card-text">Prezzo: $${book.prezzo.toFixed(2)}</p>
                <p class="card-text">Disponibilità:${book.disponibilità ? 'Disponibile' : 'Non disponibile'}</p>
            </div>
            <button onclick="openEditModal(${book.id})" class="btn btn-primary m-1">Modifica</button>
            <button onclick="deleteBook(${book.id})" class="btn btn-danger m-1">Elimina</button>
        </div>
    </div>
</div>
    `;
}

document.addEventListener('DOMContentLoaded',function (){

    const storedData = localStorage.getItem('BooksData');
    data = storedData ? JSON.parse(storedData) : JSON.parse(JSONData);

    const container = document.getElementById('cards-container');
    if(!container) {
        console.error('Container element not found');
        return;
    }

    if(!Array.isArray(data) || !data.length) {
        console.log('No books data available');
        return;
    }

    let allCardsHTML =data.map(book => {
        if(!book.copertina || !book.titolo || !book.autore) {
            console.log('book data in incomplete',book);
            return '';
        }
        return createCardHTML(book);
    }).join('');

    container.insertAdjacentHTML('beforeend', allCardsHTML);

    createGenreSwitches(data);
});

//------------------------------------------------------------------------------

function filterByProperty(propertyName, value) {
    if(!Array.isArray(data)){
        console.error('Invalid data: expected an array of books');
        return;
    }
    const filteredData = data.filter(book=> book[propertyName] && book[propertyName] ===value);
    displayBooks(filteredData);
}

//------------------------------------------------------------------------------

function displayBooks(filteredData) {
    console.log(filteredData);
    const container=document.getElementById('cards-container');

    container.innerHTML='';
    filteredData.forEach(book=> {
        const htmlContent =createCardHTML(book);
        container.insertAdjacentHTML('beforeend', htmlContent);
    });
}//----------------------------------------------------------------------------

let debounceTimeout;

function searchBooks() {
    const searchBox=document.getElementById('searchBox');
    if(!searchBox) {
        console.error('Search box element not found');
        return;
    }
    clearTimeout(debounceTimeout);
    debounceTimeout=setTimeout(() =>{
        const searchTerm =searchBox.value.trim().toLowerCase();
        let filteredData;
        if(searchTerm) {
            filteredData = data.filter(book =>
                book.titolo.toLowerCase().includes(searchTerm) ||
                book.autore.toLowerCase().includes(searchTerm)
            );
        }else{
            filteredData=data;
        }
        displayBooks(filteredData);
    },300);
}
//--------------------------------------------------------------------------------------------------

function openEditModal(bookId) {
    const book = data.find(b =>b.id === bookId);
    if(!book) {
        console.error('Book not found');
        return;
    }

    document.getElementById('bookTitle').value = book.titolo;
    document.getElementById('bookAuthor').value = book.autore;
    document.getElementById('bookYear').value = book.anno;
    document.getElementById('bookGenre').value = book.genere;
    document.getElementById('bookPrice').value = book.prezzo;

    document.getElementById('saveChanges').addEventListener('click', function (){
        saveChanges(bookId);
    })
    $('#editBookModal').modal('show');


}
//---------------------------------------------------------------------------------------------------

function  saveChanges(bookId) {
    const book = data.find(b => b.id === bookId);
    if(book){
        book.titolo = document.getElementById('bookTitle').value;
        book.autore = document.getElementById('bookAuthor').value;
        book.anno = document.getElementById('bookYear').value;
        book.genere = document.getElementById('bookGenre').value;
        book.prezzo = parseFloat(document.getElementById('bookPrice').value);
    }

    localStorage.setItem('booksData', JSON.stringify(data));

    $('#editBookModal').modal('hide');
    displayBooks(data);
}

//---------------------------------------------------------------------------------------------------

function removeLocalStorage() {
    localStorage.removeItem('booksData');
    displayBooks(JSON.parse(JSONData));
}

//---------------------------------------------------------------------------------------------------

function createGenreSwitches() {
    const genres = new Set(data.map(book => book.genere));
    const container = document.getElementById('genreFilter');
    container.innerHTML = '';

    const allWrapper = document.createElement('div');
    allWrapper.className = 'custom-control custom-switch';

    const allSwitch = document.createElement('input');
    allSwitch.type = 'checkBox';
    allSwitch.className = 'custom-control-input';
    allSwitch.id = 'all-books';
    allSwitch.name = 'bookFilter';
    allSwitch.checked = true;
    allSwitch.nochange = () => {
        document.querySelectorAll('#genreFilter .custom-control-input').forEach(input => {
            if(input !== allSwitch){
                input.checked = false;
            }
        });
        if(allSwitch.checked){
            displayBooks(data);
        }
    };

    const allLabel = document.createElement('label');
    allLabel.className = 'custom-control-label';
    allLabel.htmlFor = 'all-books';
    allLabel.textContent = 'Mostra tutti';

    allWrapper.appendChild(allSwitch);
    allWrapper.appendChild(allLabel);
    container.appendChild(allWrapper);

    genres.forEach(genre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-control custom-switch';

        const genreSwitch = document.createElement('input');
        genreSwitch.type = 'checkBox';
        genreSwitch.className = 'custom-control-input';
        genreSwitch.id = genre;
        genreSwitch.name = 'bookFilter';
        genreSwitch.nochange=() => {
            allSwitch.checked = false;
            document.querySelectorAll('#genreFilter .custom-control-input').forEach(input => {
                if(input !== genreSwitch) {
                    input.checked = false;
                }
            });
            filterByProperty('genere', genreSwitch.checked ? genre: null)
        }


        const label = document.createElement('label');
        label.className = 'custom-control-label';
        label.htmlFor = genre;
        label.textContent = genre;

        wrapper.appendChild(genreSwitch);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    })
}

//-----------------------------------------------------------------------------------------------

document.getElementById('addBookForm').addEventListener('submit', function (event){
    event.preventDefault();

    const newBook = {
        titolo: document.getElementById('newBookTitle').value,
        autore: document.getElementById('newBookAuthor').value,
        anno: parseInt(document.getElementById('newBookYear').value),
        genere: document.getElementById('newBookGenre').value,
        prezzo: parseFloat(document.getElementById('newBookTitle').value),
        disponibilità: document.getElementById('newBookAvailability').value === 'true'

    };

    data.push(newBook);
    localStorage.set('booksData', JSON.stringify(data));
    displayBooks(data);

    $('#addBookModal').modal('hide');

});

//----------------------------------------------------------------------------------------------

function deleteBook(bookId) {
    data = data.filter(book => book.id == bookId );

    localStorage.setItem('bookData', JSON.stringify(data));

    displayBooks(data);
}