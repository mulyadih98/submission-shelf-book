const storageKey = 'book-shelf'
const form = document.querySelector(".form");
const title = document.querySelector("#judul");
const author = document.querySelector("#penulis");
const year = document.querySelector("#tahun");
const isComplete = document.querySelector("#read");
const search = document.querySelector("#search");
const inputSearch = document.querySelector("#input-search");

if(localStorage.getItem(storageKey) == null){
	localStorage.setItem(storageKey, '[]')
}


const clearForm = () => {
	title.value = '';
	author.value = '';
	year.value = '';
	isComplete.checked = false;
}

const fillForm = (titleParam, authorParam, yearParam, isCompleteParam) => {
	title.value = titleParam
	author.value = authorParam
	year.value = yearParam
	isComplete.checked = isCompleteParam
}

const getBookFromShelf = () => {
	return JSON.parse(localStorage.getItem(storageKey))
}

const addBookToShelf = (title, author, year, isComplete) => {
	const data = getBookFromShelf()
	data.push({
		id: +new Date(),
		title,
		author,
		year,
		isComplete
	})
	localStorage.setItem(storageKey,JSON.stringify(data));
	showShelf(data)
}

const changeStatus = (id) => {
	const data = getBookFromShelf()
	data.forEach((book,index) => {
		if(book.id == id){
			data[index].isComplete = !data[index].isComplete
			return
		}
	});
	localStorage.setItem(storageKey,JSON.stringify(data));
	showShelf(data)
}

const editBook = (id) => {
	const data = getBookFromShelf();
	const index = data.map(book => book.id).indexOf(id)
	fillForm(
		data[index].title,
		data[index].author,
		data[index].year,
		data[index].isComplete
	)
}

const updateBook = (index, titleParam, authorParam, yearParam, isCompleteParam) => {
	const data = getBookFromShelf()
	console.log(index)
	console.log(data[index])
	data[index].title = titleParam
	data[index].author = authorParam
	data[index].year = yearParam
	data[index].isComplete = isCompleteParam
	localStorage.setItem(storageKey,JSON.stringify(data))
	showShelf(data)
}


const deleteBook = (id) => {
	//storage = storage.filter(book => book.id != id)
	const data = getBookFromShelf()
	const index = data.map(book => book.id).indexOf(id)
	data.splice(index, 1)
	localStorage.setItem(storageKey,JSON.stringify(data))
	showShelf(data)
}



const showShelf = (data) => {
	document.querySelector("#readed").innerHTML = ''
	document.querySelector("#unread").innerHTML = ''
	data.forEach(book => {
		if(book.isComplete) {
			document.querySelector("#readed").innerHTML += `
				<article class="card">
					<h2>${book.title} (${book.year})</h2>
					<p>${book.author}</p>
					<button onclick="changeStatus(${book.id})" class="btn bg-green">Belum selesai DiisComplete</button>
					<button onclick="editBook(${book.id})" class="btn bg-blue">Ubah buku</button>
					<button onclick="deleteBook(${book.id})" class="btn bg-red">Hapus buku</button>
				</article>
			`
			return
		}
		document.querySelector("#unread").innerHTML += `
				<article class="card">
					<h2>${book.title} (${book.year})</h2>
					<p>${book.author}</p>
					<button onclick="changeStatus(${book.id})" class="btn bg-green">Sudah selesai DiisComplete</button>
					<button onclick="editBook(${book.id})" class="btn bg-blue">Ubah buku</button>
					<button onclick="deleteBook(${book.id})" class="btn bg-red">Hapus buku</button>
				</article>
			`
	})
}

 


window.addEventListener("DOMContentLoaded", () => {
	
	form.addEventListener("submit", (e) =>{
		e.preventDefault()
		const data = getBookFromShelf();
		const index = data.map(book => book.title.toLowerCase()).indexOf(title.value.toLowerCase())
		
		if(index >= 0){
			console.log(index)
			updateBook(index, title.value, author.value, year.value, isComplete.checked)
		}else{
			addBookToShelf(title.value,author.value,year.value,isComplete.checked);
		}
		clearForm()
	})

	search.addEventListener("submit",(e)=>{
		e.preventDefault()
		const data = getBookFromShelf()
		let dataTemp = data.map(book => {
			if(book.title.includes(inputSearch.value)){
				return book
			}
		})
		dataTemp = dataTemp.filter(book => book !== undefined)
		inputSearch.value = ''
		showShelf(dataTemp)
	})
	
	showShelf(getBookFromShelf())
})