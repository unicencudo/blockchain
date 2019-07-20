var express = require('express');
var router = express.Router();
var Web3 = require('web3');
const fs = require('fs')
var TruffleContract = require('truffle-contract');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

$ = require('jquery')(window);
var contracts= {};
var allAddresses = [];
var AccessContract;
var web3;
var web3provider;

/*** [TODO] Change the json file ***/
var data = require('../contracts/build/contracts/AccessControl.json');

/* GET home page. */
router.get('/', function(req, res, next) {

    web3provider = new Web3.providers.WebsocketProvider('http://localhost:7545');
    web3 = new Web3(web3provider);
    //console.log(web3);
    web3.eth.getAccounts().then(console.log);
    web3.eth.getAccounts(function(error, accounts) {
        if(error) {
            console.log(error);
        }
        for(var i=0; i<accounts.length; i++) {
            allAddresses.push(accounts[i].toString());
        }
    });

    res.append("AllUserAcctAddrs", allAddresses)

    res.render('LoanTermAcceptance');
});

router.post('/', function(req, res, next) {
    //console.log("Test");
    try {
/*** [TODO] Change the json file ***/
        if (fs.existsSync("AccessControl.json")) {
            console.log("exists");
        }
    } catch(err) {
        console.log(err)
    }

    let selUsrAcct = req.body.selUsrAcct;
    let txtPurpose = req.body.txtPurpose;
    let txtAmount = req.body.txtAmount;
    let txtTenure = req.body.txtTenure;


    web3provider = new Web3.providers.WebsocketProvider('http://localhost:7545');
    web3 = new Web3(web3provider);
    //console.log(web3);
    // web3.eth.getAccounts().then(console.log);
    // web3.eth.getAccounts(function(error, accounts) {
    //     if(error) {
    //         console.log(error);
    //     }
    //     for(var i=0; i<accounts.length; i++) {
    //         allAddresses.push(accounts[i].toString());
    //     }
    // });
    // let role= parseInt(req.body.role);
    // let username = req.body.username;
    // let sba_address= req.body.sba_address;
    // let sender= req.body.sender_address;
    // let borrower= req.body.borrower_address;
    // let amount= req.body.amount;

    console.log(role+" : " +username + " : " + sender +" : "+borrower + ":" + amount);

    init_contract(sba_address);
    add_borrower(username,borrower);

    make_transfer(sender,borrower, username, amount);
    borrow(sba_address,borrower,username, amount)
});

var accesscontrol;

function init_contract(sba_address) {
    console.log("init_contract");
    //console.log(data);
    var accessArtifact = data;
    AccessContract = TruffleContract(accessArtifact);
    AccessContract.setProvider(web3provider);

    accesscontrol = new web3.eth.Contract(data.abi,'0x1e8171208B1a91c9D44786e6fbB5fBad00049a1f');
    //console.log(data.abi);

    accesscontrol.methods.renderHelloWorld.call().then(function(result){
        console.log(result);
    })

    /*accesscontrol.methods.setSBA(sba_address).call().then(function(result){
        console.log(result);
    })*/
}


module.exports = router;
