/*
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

var data = require('../contracts/build/contracts/AccessControl.json');

/!* GET home page. *!/
router.get('/', function(req, res, next) {
    res.render('register');
});

router.post('/', function(req, res, next) {
    //console.log("Test");
    try {
        if (fs.existsSync("AccessControl.json")) {
            console.log("exists");
        }
    } catch(err) {
        console.log(err)
    }

    web3provider = new Web3.providers.WebsocketProvider('http://localhost:1818');
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
    let role= parseInt(req.body.role);
    let username = req.body.username;
    let sba_address= req.body.sba_address;
    let sender= req.body.sender_address;
    let borrower= req.body.borrower_address;
    let amount= req.body.amount;

    console.log(role+" : " +username + " : " + sender +" : "+borrower + ":" + amount);

    init_contract(sba_address);
    add_borrower(username,borrower);

    make_transfer(sender,borrower, username, amount);
    borrow(sba_address,borrower,username, amount)
});

var accesscontrol;

function add_borrower(username,borrower){
    accesscontrol.events.addBorrower({}, (error, event) => { console.log(event); })

    accesscontrol.methods.add_borrower(username).send({from: borrower, gas:3000000}).on('error', console.error)
}
function init_contract(sba_address) {
    console.log("init_contract");
    //console.log(data);
    var accessArtifact = data;
    AccessContract = TruffleContract(accessArtifact);
    AccessContract.setProvider(web3provider);

    accesscontrol = new web3.eth.Contract(data.abi,'0xeD61dcE20542617146088401AdC551F9e23a6b28');
//    accesscontrol = new web3.eth.Contract(data.abi,'0x1e8171208B1a91c9D44786e6fbB5fBad00049a1f');
    //console.log(data.abi);

    accesscontrol.methods.renderHelloWorld.call().then(function(result){
        console.log(result);
    })

    /!*accesscontrol.methods.setSBA(sba_address).call().then(function(result){
        console.log(result);
    })*!/
}

function make_transfer(sender, borrower, username, amount) {
    //ABI
    /!*console.log("transferring");
    let wei_amt= web3.utils.toWei(amount,'ether');
    web3.eth.sendTransaction({from:sender, to:receiver, value:wei_amt, gas:21000}).then(function(receipt){
            console.log(receipt);
    });*!/
    let wei_amt= web3.utils.toWei(amount,'ether');
    console.log(wei_amt);

    accesscontrol.events.invest({}, (error, event) => { console.log(event); })
    accesscontrol.events.borrowEvent({}, (error, event) => { console.log(event); })


    accesscontrol.methods.deposit().send({from:sender, value:wei_amt, gas:50000}).on('error', console.error)

    accesscontrol.methods.accept_fund(wei_amt).send({from: sender}).on('error', console.error)

}


function borrow(sba_address, borrower, username, amount) {

    let wei_amt= web3.utils.toWei(amount,'ether');
    console.log(wei_amt);

    accesscontrol.events.borrowEvent({}, (error, event) => { console.log(event); })

    accesscontrol.methods.deposit().send({from:sba_address, value:wei_amt, gas:50000}).on('error', console.error)

    accesscontrol.methods.borrow(username,wei_amt).send({from: borrower}).on('data', (event) => {
        console.log(event);
    }).on('error', console.error)
}

// function hello_world(){
//     //ABI
//     var hellocontract = new web3.eth.Contract(data.abi,'0x1e8171208B1a91c9D44786e6fbB5fBad00049a1f');
//     console.log(data.abi);
//
//     hellocontract.methods.renderHelloWorld.call().then(function(result){
//         console.log(result);
//     })
// }

function register_user(role,username){

    console.log("register_user");
    var contractInstance;
    var address = allAddresses.pop();
    AccessContract.deployed().then(function(instance) {
        contractInstance = instance;
        return contractInstance.adduser(username,role,address);

    }).then(function(result) {
        console.log(username + " balance ether: "+ web3.eth.getBalance(result));
    }).catch(function(err) {
        console.log(err.message);
    });
}


module.exports = router;
*/
