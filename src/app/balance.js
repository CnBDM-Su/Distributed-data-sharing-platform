App = {
    init: function () {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            window.web3 = new Web3(web3.currentProvider);
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        }
        App.initContract();
    },

    initContract: function () {
        $.getJSON('Book.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            window.book = TruffleContract(data);
            // Set the provider for our contract
            window.book.setProvider(web3.currentProvider);
            // Init app
          //  App.getBooks();
        });
    },
    getBalance: function () {
        book.deployed().then(function (bookInstance) {
            //   var result = _getBookInfo(BorrowId);
            //   var owner = result[0];
            bookInstance.getBalance.call().then(function (r) {
                alert(r);
            });
        });
    },
}