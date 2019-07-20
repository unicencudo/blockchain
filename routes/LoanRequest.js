/*** [TODO] Update Constants ***/
const cDataJsonFullPath = '../contracts/build/contracts/SILS.json';
const cWeb3URL = 'http://localhost:7545';
const cContractAddress = '0x1e8171208B1a91c9D44786e6fbB5fBad00049a1f';

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

var data = require(cDataJsonFullPath);
var SmartContract;

function init_contract() {
    console.log("init_contract");
    //console.log(data);
    var accessArtifact = data;
    AccessContract = TruffleContract(accessArtifact);
    AccessContract.setProvider(web3provider);

    accesscontrol = new web3.eth.Contract(data.abi,cContractAddress);
    //console.log(data.abi);

    accesscontrol.methods.renderHelloWorld.call().then(function(result){
        console.log(result);
    })
}
/* GET home page. */
router.get('/', async function(req, res, next) {
    // //    web3 = new Web3(new Web3.providers.HttpProvider(cWeb3URL));
    // web3 = new Web3(new Web3.providers.WebsocketProvider(cWeb3URL));
    //
    // let accounts = await web3.eth.getAccounts();
    // let SBA_Acct = accounts.shift(); // remove the first account (Default first account to be SBA)
    //
    // res.render('LoanRequest', {arrAllAddr: accounts, SBA_Acct: SBA_Acct});

    fnResp(res);
});

router.post('/', function(req, res, next) {
    console.log("[Test] router.post");
    try {
        if (fs.existsSync(cDataJson)) {
            console.log("exists");
        }
    } catch(err) {
        console.log(err)
    }

    let SBA_Acct = req.body.hidSBAAcct;
    let selUsrAcct = req.body.selUsrAcct;
    let txtPurpose = req.body.txtPurpose;
    let txtAmount = req.body.txtAmount;
    let txtTenure = req.body.txtTenure;

    console.log("selUsrAcct = [" + selUsrAcct + "]; txtPurpose = [" + txtPurpose +
        "]; txtAmount = [" + txtAmount + "];  txtTenure = [" + txtTenure + "]; ");

    web3provider = new Web3.providers.WebsocketProvider(cWeb3URL);
    web3 = new Web3(new Web3.providers.WebsocketProvider(cWeb3URL));

    // init_contract(selUsrAcct);
    make_transfer(selUsrAcct, txtAmount);

    let respMsg = "Loan Request Submitted! <br/>[From: " + selUsrAcct + "; <br/>Purpose: " + txtPurpose +
        "; Amount: " + txtAmount + ";  Tenure: " + txtTenure + ";]";
    fnResp(res, respMsg);
});

function init_contract(sba_address) {
    console.log("init_contract");
    var accessArtifact = data;
    AccessContract = TruffleContract(accessArtifact);
    AccessContract.setProvider(web3provider);

    accesscontrol = new web3.eth.Contract(data.abi, cContractAddress);
    console.log("data.abi = [" + data.abi + "]");

    // accesscontrol.methods.setSBA(sba_address).call().then(function(result){
    //     console.log(result);
    // })
}

function make_transfer(sender, amount) {
//function make_transfer(sender, borrower, username, amount) {
    console.log("transferring");
    //ABI
    /*
    let wei_amt= web3.utils.toWei(amount,'ether');
    web3.eth.sendTransaction({from:sender, to:receiver, value:wei_amt, gas:21000}).then(function(receipt){
            console.log(receipt);
    });*/
    let wei_amt= web3.utils.toWei(amount,'ether');
    console.log("wei_amt = [" + wei_amt + "]");

    accesscontrol = new web3.eth.Contract(data.abi, cContractAddress);
    console.log("data.abi = [" + data.abi + "]");

    // accesscontrol.events.invest({}, (error, event) => { console.log(event); })
    // accesscontrol.events.borrowEvent({}, (error, event) => { console.log(event); })


    accesscontrol.methods.deposit().send({from:sender, value:wei_amt, gas:50000}).on('error', console.error)

//    accesscontrol.methods.accept_fund(wei_amt).send({from: sender}).on('error', console.error)
}


async function fnResp(res, respMsg=null){
    //    web3 = new Web3(new Web3.providers.HttpProvider(cWeb3URL));
    web3 = new Web3(new Web3.providers.WebsocketProvider(cWeb3URL));

    let accounts = await web3.eth.getAccounts();
    let SBA_Acct = accounts.shift(); // remove the first account (Default first account to be SBA)

    res.render('LoanRequest', {arrAllAddr: accounts, SBA_Acct: SBA_Acct, lblMsg: respMsg});
}

module.exports = router;
