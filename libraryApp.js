(function(){
'use stric';

angular.module('LibraryApp', ['ui.bootstrap'])
.controller('LibraryController', LibraryController)
.service('LibraryService', LibraryService);

LibraryController.$inject = ['LibraryService', '$filter', '$uibModal'];
function LibraryController (LibraryService, $filter, $uibModal){
	var library = this;

	var books = LibraryService.getBooks();

	books.then(function (response) {
		library.books = response.data;
		library.totalItems = library.books.length;
	})
	.catch(function (error) {
		library.getBooks = "Something went terribly wrong.";
		console.log("Something went terribly wrong.");
	});

	//	pagination
	library.pagination = {
		
		currentPage : 1,
		itemsPerPage : 5,
		maxSize : 5	
	}

	//	new/edit book state
	library.addBookOpen = false;
	library.addBook = function(bookForm){
		var newBook = {
			name : library.new_book.name,
			author : library.new_book.author,
			category : library.new_book.category,
			publishedDate : library.new_book.publishedDate,
			user : ''
		}

		library.books.unshift(newBook);

		library.new_book = {}
		library.open = false;
	}

	library.editBookOpen = false;
	library.edit_book = {};
	library.editBook = function(book, index){
		console.log(book);
		var date =  new Date(book.publishedDate);

		library.edit_book.name = book.name;
		library.edit_book.author = book.author;
		library.edit_book.category = book.category;
		library.edit_book.publishedDate = date;
		library.edit_book.position = index;		

		library.editBookOpen = true;
	}

	library.updateBook = function () {
		library.books[library.edit_book.position] = {
			name : library.edit_book.name,
			author : library.edit_book.author,
			category : library.edit_book.category,
			publishedDate : library.edit_book.publishedDate,
			user : ''	
		};

		library.edit_book = {}
		library.editBookOpen = false;
	}

	library.deleteBook = function(book, index){
		library.books.splice(index,1);
	}

	library.filterItems = function(){
		var items = $filter('filter')(library.books, library.category);
		library.totalItems = items.length;
	}

	library.modalOpen = '';
	library.available_book = {};
	library.showModal = function(book, index){
		library.available_book.name = book.name;
		library.available_book.user = book.user;
		library.available_book.index = index;
		library.modalOpen = 'in';
	}

	library.closeModal = function () {
		library.modalOpen = '';
		library.available_book = {};
	}

	library.updateAvailability = function(book){
		library.books[book]['user'] = library.available_book.user;
		library.closeModal();
	}
}



LibraryService.$inject = ['$http'];
function LibraryService ($http){
	var service = this;

	service.getBooks =  function(){
		var response = $http({
			method : 'GET',
			url : 'books.json'
		});

		return response;
	}
}

})();