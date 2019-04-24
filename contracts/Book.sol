pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";

contract ML_Token is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {
    uint private INITIAL_SUPPLY = 10000e18;
    mapping (address => uint256) private _balances;

    constructor() public
        ERC20Burnable()
        ERC20Mintable()
        ERC20Detailed("ML_Token", "MT", 18)
        ERC20()
    {_mint(msg.sender, INITIAL_SUPPLY);}
    function mintM(address addr, uint num) public{
        _balances[addr] = _balances[addr].add(num);
    }
    function costM(address addr, uint num) public{
        _balances[addr] = _balances[addr].sub(num);
    }
}


contract Book is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {
    uint private INITIAL_SUPPLY = 4;
    mapping (address => uint256) private _balances;

    constructor() public
    ERC20Burnable()
    ERC20Mintable()
    ERC20Detailed("ML_Token", "MT", 18)
    ERC20()
    {_mint(msg.sender,INITIAL_SUPPLY);}
    function mintM(address addr, uint num) public{
        _balances[addr] = _balances[addr].add(num);
    }
    function costM(address addr, uint num) public{
        _balances[addr] = _balances[addr].sub(num);
    }
    struct OptBook{
        uint[] publishedBooks;
        uint[] borrowedBooks;
        uint[] returnedBooks;
        uint[] commentedBooks;
    }

    struct Book{
        address owner;
        string nameWriter;
        string style;
        string publisherPublishAge;
        string ISBN;
        string intro;
        string cover;

        uint pages;
        uint publishDate;
        uint score;
        uint comment;
        uint borrowNums;
        mapping(uint => Comment) comments;
//        mapping(uint => BorrowNums) borrowNums;
    }

    struct Comment {
        address reader;
        uint date;
        uint score;
        string content;
    }
//
//    struct BorrowNums{
//        uint borrowNum;
//    }

    Book[] books;
    uint tempNum = 1;
    mapping(address => OptBook) BooksPool;

    event publishBookSuccess(uint id, string nameWriter, string style, string publisherPublishAge,
        string ISBN,string intro, string cover, uint pages,
        uint publishDate);

    event evaluateSuccess(uint id,address addr,uint score);

    event borrowSuccess(uint id, address addr);

    event returnBookSuccess(uint id, address addr);

    event balanceOfUser(address addr, uint num);

    event publishReward(address addr, uint num);

    event downloadCost(address addr, uint num);

    function getBorrowedBooks() public view returns (uint[] memory){
        return BooksPool[msg.sender].borrowedBooks;
    }

    function getCommentedBook() public view returns(uint[] memory){
        return BooksPool[msg.sender].commentedBooks;
    }

    function getPublishedBooks() public view returns(uint[] memory){
        return BooksPool[msg.sender].publishedBooks;
    }

    function getReturnedBooks() public view returns(uint[] memory){
        return BooksPool[msg.sender].returnedBooks;
    }


    function getBooksLength() public view returns(uint){
        return books.length;
    }


    function getCommentLength(uint id) public view returns (uint) {
        return books[id].comment;
    }


    function getBorrowNums(uint id) public view returns(uint){
        Book storage book = books[id];
//        BorrowNums storage b = book.borrowNums[0];
        return book.borrowNums;
    }
    

    function getBookInfo(uint id) public view returns(address, string memory, string memory, string memory,string memory,string memory,string memory,
         uint, uint, uint, uint){
        require(id < books.length);

        Book storage book = books[id];
        return (book.owner,book.nameWriter,book.style,book.publisherPublishAge,book.ISBN,book.intro,book.cover,
        book.pages,book.publishDate,book.score,book.comment);
    }


    function getCommentInfo(uint bookId,uint commentId) public view returns(
        address, uint, uint, string memory){
        require(bookId < books.length);
        require(commentId < books[bookId].comment);
        Comment storage c = books[bookId].comments[commentId];
        return (c.reader, c.date, c.score, c.content);
    }


    function isEvaluated(uint id) public view returns (bool) {
        Book storage book = books[id];
        for(uint i = 0; i < book.comment; i++)
            if(book.comments[i].reader == msg.sender)
                return true;
        return false;
    }


    function isBorrowed(uint id) public view returns (bool) {
        OptBook storage optBook = BooksPool[msg.sender];
        for(uint i = 0; i < optBook.borrowedBooks.length; i++)
            if(optBook.borrowedBooks[i] == id)
                return true;
        return false;
    }

    function isMyBook(uint id) public view returns(bool){
        Book storage book = books[id];
        if(book.owner == msg.sender)
            return true;
        return false;
    }

    function isBookLeft(uint id) public payable returns(bool){
        require(id<books.length);
        Book storage book = books[id];
        return false;
    }
    function increase() public {
        mintM(msg.sender,1);
    }


    function publishBookInfo(string memory nameWriter, string memory style, string memory publisherPublishAge,string memory ISBN,string memory intro,
        string memory cover ,uint pages) public {
        uint id = books.length;
        Book memory book = Book(msg.sender,nameWriter,style,publisherPublishAge,ISBN,intro,cover,pages,now,0,0,0);
        books.push(book);
        BooksPool[msg.sender].publishedBooks.push(id);

      //  emit balanceOfUser(msg.sender, balanceOf(msg.sender));
        _mint(msg.sender, 5);
      //  emit balanceOfUser(msg.sender, balanceOf(msg.sender));
     //   emit Transfer(msg.sender,0xa8aBb7b302A27061ad350941472C0A14C44E8264,1);
     //   mintM(msg.sender,1);

    //    emit publishReward(msg.sender, 1);
        emit publishBookSuccess(id,book.nameWriter,book.style,book.publisherPublishAge,book.ISBN,book.intro,book.cover,
            book.pages,book.publishDate);
    }


    function evaluate(uint id, uint score, string memory content) public{
        require(id < books.length);

        Book storage book = books[id];
        //require(book.owner != msg.sender && !isEvaluated(id));
        require(0 <= score && score <= 10);

        book.score += score;
        book.comments[book.comment++] = Comment(msg.sender, now, score, content);
        BooksPool[msg.sender].commentedBooks.push(id);
        emit evaluateSuccess(id, msg.sender, book.score);
    }




    function borrowedBook(uint id) public{
        require(id < books.length);
        Book storage book = books[id];
        require(balanceOf(msg.sender) >= 5);
//        book.borrowNums[0] = BorrowNums(tempNum++);
        book.borrowNums+=1;
        BooksPool[msg.sender].borrowedBooks.push(id);
        _burn(msg.sender,5);
    //    costM(msg.sender, 2);
        emit borrowSuccess(id, msg.sender);

    }
//NEW FUNCTION

    function getAddr() public view returns(address){
        return msg.sender;
    }

    function getBalance() public view returns(uint256){
        uint256 balance = balanceOf(msg.sender);
        return balance;
    }
  //  function getBalanceOf(address addr) public{
  //      return balanceOf(addr);
   // }

    function dataMint(address addr, uint num) public{
        mint(addr,num);
        emit publishReward(addr, num);
    }

    function dataCost(uint num) public{
        burn(num);
        emit downloadCost(msg.sender, num);
    }

    function hashCompareInternal(string memory a, string memory b) internal returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function () external {
        revert();
    }
}