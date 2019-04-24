var Book = artifacts.require("Book");
var ML_Token = artifacts.require("ML_Token");

module.exports = function(deployer) {
    deployer.deploy(ML_Token);
    deployer.deploy(Book);
};
