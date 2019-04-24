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
            App.getBooks();
        });
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    pageCallback: async function (index, jq) {
        $("#books").html('');
        var pageNum = 8;
        var start = index * pageNum; // 开始
        var end = Math.min((index + 1) * pageNum, totalBooksNum); // 结束
        var content = '';
        for (var i = start; i < end; i++) {
            var result = await App._getBookInfo(i);
            content += '<div class="col-sm-6 col-md-12" >'
                + '<div class="thumbnail">'
                + '<a href="book.html?id=' + i + '">'
                + '<div style="position: relative;">'
                + '<img id="cover" class="img-cover" src="' + result[6] + '" alt=""/>'
                + '<figcaption id="nameWriter" style="font-size: 20px; color: black; font-weight:bold; font-family:Trattatello">' + result[1] + '</figcaption>'
                + '</div>'
                + '</a>'
                + '<div class="caption">'
                + '<table class="dashed_tbl">'
                +'</table>'
                + '<span class="label label-default"> Type</span>'
                + '<samp id="style">' + result[2] + '</samp>'
                + '<br/>'
                + '<span class="label label-default"> Inspiration</span>'
                + '<samp id="publisherPublishAge">' + result[3] + '</samp>'
                + '<br/>'
                + '<span class="label label-default"> Tag</span>'
                + '<samp id="ISBN">' + result[4] + '</samp>'
                + '<br/>'
                + '<span class="label label-default"> #instance</span>'
                + '<samp id="pages">' + result[8] + '</samp>'
                + '<br/>'

                + '<span class="label label-default"> Description</span>'
                + '<samp id="intro">' + result[5].substr(0, 100) + '</samp>'
                + '<br/>'
                + '<div align="right">'
                + '<button class="btn btn-default btn-xs" data-toggle="modal" data-target="#modal"'
                + 'onclick="App.set('+i+')">Download'
                + '</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';
        }
        $("#books").append(content);
    },

    pageCallSearchback: async function (index, jq) {
        $("#books").html('');
        var pageNum = 8;
        var start = index * pageNum; // 开始
        var end = Math.min((index + 1) * pageNum, totalBooksNum); // 结束
        var content = '';
        for (var i = start; i < end; i++) {
            var result = searchList[i][1];
            // var borrowNum = await App._getBorrowedNums(searchList[i][0]);
            content += '<div class="col-sm-6 col-md-3" >'
                + '<div class="thumbnail">'
                + '<a href="book.html?id=' + searchList[i][0]+ '">'
                + '<div style="position: relative;">'
                + '<img id="cover" class="img-cover" src="' + result[6] + '" alt=""/>'
                + '<figcaption id="nameWriter" class="img-caption">' + result[1] + '</figcaption>'
                + '</div>'
                + '</a>'
                + '<div class="caption">'
                + '<table class="dashed_tbl">'

                +'</table>'
                + '<span class="label label-info">Type</span>'
                + '<samp id="style">' + result[2] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">Inspiration</span>'
                + '<samp id="publisherPublishAge">' + result[3] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">Tag</span>'
                + '<samp id="ISBN">' + result[4] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">#Instance</span>'
                + '<samp id="pages">' + result[8] + '</samp>'
                + '<br/>'

                + '<span class="label label-info">Description</span>'
                + '<samp id="intro">' + result[5].substr(0, 20) + '......</samp>'
                + '<br/>'
                + '<div align="center">'
                + '<button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#modal"'
                + 'onclick="App.set('+ searchList[i][0] +')">Download'
                + '</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';
        }
        $("#books").append(content);
    },

    getHomeBookByKeyword: async function(keyword){
        var tempNum = await App._getBooksLength();
        var saleTempList = new Array();
        var start = 0;
        var newArray = new Array();
        for(var i = start;i<tempNum;i++){
            saleTempList[i] = new Array(2);
            var resultInfo = await App._getBookInfo(i);
            if(resultInfo[1].match(keyword)==null){
            }else {
                saleTempList[i][0]=i;
                saleTempList[i][1]=resultInfo;
                newArray.push(saleTempList[i]);
            }
        }
        window.searchList = newArray;
        window.totalBooksNum = newArray.length;
        $("#pagination").pagination(totalBooksNum, {
            callback: App.pageCallSearchback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
        if(newArray.length==0){
            alert("");
        }
    },

    getHomeBookByType: async function(type){
        var tempNum = await App._getBooksLength();
        var saleTempList = new Array();
        var start = 0;
        var newArray = new Array();
        for(var i = start;i<tempNum;i++){
            saleTempList[i] = new Array(2);
            var resultInfo = await App._getBookInfo(i);
            if(resultInfo[2].match(type)==null){
            }else {
                saleTempList[i][0]=i;
                saleTempList[i][1]=resultInfo;
                newArray.push(saleTempList[i]);
            }
        }
        window.searchList = newArray;
        window.totalBooksNum = newArray.length;
        $("#pagination").pagination(totalBooksNum, {
            callback: App.pageCallSearchback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
        if(newArray.length==0){
            alert("");
        }
    },

    set: function (_id) {
        window.BorrowId = _id;
    },
/*
    getBalance: function(){
        book.deployed().then(function (bookInstance) {
            //   var result = _getBookInfo(BorrowId);
            //   var owner = result[0];
            bookInstance.getBookInfo.call(BorrowId).then(function (r) {
                alert(r[0]);
            });
        });
    },
  */
    getBalance: function(){
        book.deployed().then(function (bookInstance) {
         //   var result = _getBookInfo(BorrowId);
         //   var owner = result[0];
            bookInstance.getBalance.call().then(function (r) {
                alert(r);
            });
            });
    },

    borrowBooks: function(){
        book.deployed().then(function (bookInstance) {
            bookInstance.getBookInfo.call(BorrowId).then(function (r) {
                window.open(r[6]);
            }).then(function () {
                bookInstance.borrowedBook(BorrowId, {
                    from: web3.eth.accounts[0],
                }).then(function (result) {
                    alert("Download Successfully!");
                    $("#modal").modal('hide');
                    window.location.reload();
                }).catch(function (err) {
                    alert("Failed: " + err);
                    $("#modal").modal('hide');
                    window.location.reload();
                });

            });
        });
    },
    /*
    borrowBooks: function(){
        var r =  App._getBookInfo(8);
        alert(r);
        window.open(r[6]);
        book.deployed().then(function (bookInstance) {
            bookInstance.isBookLeft.call(BorrowId).then(function (result) {
                if (result) {
                    $("#borrowBookBtn").html('已借阅');
                    $("#borrowBookBtn").attr("disabled", true);
                    alert("已借阅");
                    $("#modal").modal('hide');
                } else {
                    bookInstance.isMyBook.call(BorrowId).then(function (ismybook) {

                            $("#borrowBookBtn").html('借 阅');
                            $("#borrowBookBtn").attr("disabled", false);
                            bookInstance.borrowedBook(BorrowId, {
                                from: web3.eth.accounts[0],
                            }).then(function (result) {
                                alert("借阅成功,等待写入区块!");
                                $("#modal").modal('hide');
                                window.location.reload();
                            }).catch(function (err) {
                                alert("借阅失败: " + err);
                                $("#modal").modal('hide');
                                window.location.reload();
                            });

                    });
                }
            });
        });
    },

*/

    getBooks: async function(){
        window.totalBooksNum = await App._getBooksLength();
        $("#pagination").pagination(totalBooksNum, {
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },
    ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 获取书籍数量
     * @returns {Promise<any>}
     * @private
     */
    _getBooksLength: function () {
        return new Promise(function (resolve, reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getBooksLength.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    /**
     * 获取书籍详细信息
     * @param id
     * @returns {Promise<any>}
     * @private
     */
    _getBookInfo: function (id) {
        return new Promise(function (resolve,reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getBookInfo.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: "+err);
                });
            });
        });
    },
    _getBorrowedNums: function (id) {
        return new Promise(function (resolve,reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getBorrowNums.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误" + err);
                })
            })
        })
    }
}

/**
 * home.html关键词 查询
 */
function homeSearch() {
    var searchKeyWord = document.getElementById("home-keyword").value;
    App.getHomeBookByKeyword(searchKeyWord);
}

//所需单据绑定回车键
$('#home-keyword').bind('keydown',function(event){
    if(event.keyCode == "13")
    {
        homeSearch();
    }
});

/**
 * 点击事件监听器，监听list节点的点击事件
 */
document.querySelector('#list').addEventListener('click', handleClick);

function handleClick(e) {
    const target = e.target;//鼠标点击的目标
    if (target.tagName.toLowerCase() !== 'a') return;//筛选目标里面的a
    console.log(target.innerHTML);
    App.getHomeBookByType(target.innerHTML);
}


$(function () {
    // ##### note #####
    App.init();
    // ##### note #####

    // 激活导航
    $("#bookHome-menu").addClass("menu-item-active");

});