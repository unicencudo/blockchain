/*** [TODO] Update Constants ***/
var cDataJson = '../contracts/build/contracts/SILS.json';
var data = require(cDataJson);
const web3URL = 'http://localhost:7545';
const contractAddress = '0xEB99a0E809B9EB489e346A155700112A2f7A4575';

var express = require('express');
var router = express.Router();
var Web3 = require('web3');
const fs = require('fs')
var TruffleContract = require('truffle-contract');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

$ = require('jquery')(window);

var SmartContract;
var web3;

function init_contract() {
    console.log("init_contract");

    let web3provider = new Web3.providers.WebsocketProvider(web3URL);
    web3 = new Web3(web3provider);

    SmartContract = new web3.eth.Contract(data.abi,contractAddress);
    SmartContract.methods.renderHelloWorld.call().then(function(result){
        console.log(result);
    })
}
/* GET home page. */
router.get('/', function(req, res, next) {
    init_contract();
    fnResp(res);
});

router.post('/', async function(req, res, next) {
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
    let txtAmount = req.body.txtAmount;
    let respMsg= "";

    console.log("selUsrAcct = [" + selUsrAcct + "]; txtAmount = [" + txtAmount + "]; ");

    SmartContract.events.depositRule({}, (error, result) => {
        console.log(result);
        console.log(web3.utils.hexToNumberString(result.returnValues.borrowRatio));
        console.log(web3.utils.hexToNumberString(result.returnValues.requiredRatio));
    }).on('error', console.error);


    SmartContract.events.logError({}, (error, result) => {
        console.log(result);
        respMsg = result.returnValues.errormsg;
        console.log("logError Result:" + result.returnValues.errormsg);
        //fnResp(res,respMsg);
    }).on('error', console.error);

    SmartContract.events.checkDepositEvent({}, (error, result) => {console.log(result);}).on('error', console.error);

    SmartContract.events.depositEvent({}, (error, result) => {console.log(result);}).on('error', console.error);

    let wei_amt= web3.utils.toWei(txtAmount,'ether');
    console.log("Wei Amount: "+ wei_amt);

    //SmartContract.methods.deposit_fund(wei_amt).send({from:selUsrAcct});
    respMsg= await SmartContract.methods.check_deposit(selUsrAcct,wei_amt).call({});

    //the same validation as check_deposit function is incorporated into deposit_payable
    SmartContract.methods.deposit_payable().send({from:selUsrAcct, value:wei_amt, gas:50000}).on('error', console.error);


    fnResp(res,respMsg,txtAmount);
});

async function fnResp(res, respMsg=null,txtAmount=null){

    console.log(typeof(respMsg));
    console.log(respMsg);
    let accounts = await web3.eth.getAccounts();

    let SBA_Acct = accounts.shift(); // remove the first account (Default first account to be SBA)
    res.render('Funding', {arrAllAddr: accounts, SBA_Acct: SBA_Acct, lblMsg: respMsg, amount:txtAmount});
}

module.exports = router;
