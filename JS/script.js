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

        }
    });

});






