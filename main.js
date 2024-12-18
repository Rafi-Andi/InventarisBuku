document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("bookForm");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        membuatList();
    });

    const checkbox = document.getElementById('bookFormIsComplete');
    const keteranganSpan = document.getElementById('keterangan');

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            keteranganSpan.innerText = 'Telah selesai';
        } else {
            keteranganSpan.innerText = 'Belum selesai';
        }
    });

    if (checkbox.checked) {
        keteranganSpan.innerText = 'Telah selesai';
    } else {
        keteranganSpan.innerText = 'Belum selesai';
    }

    if (mendukungStorage()) {
        memuatData();
    }
});


function membuatObjek(id, judul, penulis, tahun, selesai){
    return {
        id,
        judul,
        penulis,
        tahun,
        selesai,
    }
}

const books = [];

function membuatId(){
    return +new Date()
}

const RENDER_EVENT = 'render-list';

function membuatList(){
    const judul = document.getElementById('bookFormTitle').value
    const penulis = document.getElementById('bookFormAuthor').value
    const tahun = Number(document.getElementById('bookFormYear').value)
    const selesai = document.getElementById('bookFormIsComplete').checked


    const id = membuatId();

    const bookObject = membuatObjek(id, judul, penulis, tahun, selesai);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT))

    simpanData();
}



document.addEventListener(RENDER_EVENT, function(){
    const bukuBelumSelesaiDiBaca = document.getElementById('incompleteBookList')
    bukuBelumSelesaiDiBaca.innerHTML = '';
    
    const bukuSelesaiDibaca = document.getElementById('completeBookList')
    bukuSelesaiDibaca.innerHTML = '';

    for (const bukuItem of books) {
        const bukuElemen = menampilkanBuku(bukuItem)

        if(!bukuItem.selesai){
            bukuBelumSelesaiDiBaca.append(bukuElemen)
        } else {
            bukuSelesaiDibaca.append(bukuElemen)
        }
    }
})


function menampilkanBuku(bookObject){
    const judulBuku = document.createElement('h3')
    judulBuku.setAttribute('data-testid', 'bookItemTitle')
    judulBuku.innerText = bookObject.judul;

    const penulisBuku = document.createElement('p')
    penulisBuku.setAttribute('data-testid', 'bookItemAuthor')
    penulisBuku.innerText = bookObject.penulis;

    const tahunBuku = document.createElement('p')
    tahunBuku.setAttribute('data-testid', 'bookItemYear')
    tahunBuku.innerText = bookObject.tahun;

    const kontainer = document.createElement('div');
    kontainer.classList.add('book-item')
    kontainer.append(judulBuku, penulisBuku, tahunBuku);
    kontainer.setAttribute('data-bookid', `id:${bookObject.id}`)
    kontainer.setAttribute('data-testid', 'bookItem')

    if(bookObject.selesai){
        const tombolUndo = document.createElement('button');
        tombolUndo.classList.add('button')
        tombolUndo.innerText = 'Belum Selesai'
        tombolUndo.setAttribute('data-testid', 'bookItemIsCompleteButton')
        tombolUndo.addEventListener('click', function(){
            selesaiKeBelumSelesai(bookObject.id);
        })
        
        const tombolHapus = document.createElement('button')
        tombolHapus.classList.add('button')
        tombolHapus.innerText = 'hapus buku';
        tombolHapus.setAttribute('data-testid', 'bookItemDeleteButton')
        tombolHapus.addEventListener('click', function(){
            hapusBuku(bookObject.id);
        })

        const kontainerTombol = document.createElement('div')
        kontainerTombol.classList.add('flex')
        kontainerTombol.append(tombolUndo, tombolHapus)

        kontainer.append(kontainerTombol)
    } else {
        const tombolSelesai = document.createElement('button')
        tombolSelesai.classList.add('button')
        tombolSelesai.innerText = 'selesai dibaca';
        tombolSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton')
        tombolSelesai.addEventListener('click', function(){
            belumSelesaiKeSelesai(bookObject.id)
        })

        kontainer.append(tombolSelesai);
    }

    return kontainer;
}

function belumSelesaiKeSelesai(bukuId){
    const bukuTarget = menemukanBukuId(bukuId);

    if(bukuTarget == null) return

    bukuTarget.selesai = true;

    document.dispatchEvent(new Event(RENDER_EVENT))

    simpanData()
}

function selesaiKeBelumSelesai(bukuId){
    const bukuTarget = menemukanBukuId(bukuId);

    if(bukuTarget == null) return;

    bukuTarget.selesai = false;

    document.dispatchEvent(new Event(RENDER_EVENT))

    simpanData()
}
function menemukanBukuId(bukuId){
    for (const bukuItem of books){
        if (bukuItem.id === bukuId) {
            return bukuItem;
        }
    }

    return null;
}

function hapusBuku(bukuId){
    const bukuTarget = mencariIndexBuku(bukuId)

    if(bukuTarget === -1) return

    books.splice(bukuTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))

    simpanData();
}

function mencariIndexBuku(bukuId){
    for(const index in books){
        if(books[index].id === bukuId){
            return index;
        }
    }

    return -1;
}



function simpanData(){
    if(mendukungStorage()){
        const data = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, data)
        document.dispatchEvent(new Event(SIMPAN_DATA_EVENT))
    }
}

function memuatData(){
    const dataStorage = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(dataStorage)

    if(data !== null){
        for(const buku of data){
            books.push(buku)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

const STORAGE_KEY = 'storage-key'
const SIMPAN_DATA_EVENT = 'simpan-data'
function mendukungStorage(){
    if (typeof Storage === 'undefined') {
        alert('browser anda tidak mendukung web storage')
        return false
    }

    return true;
}