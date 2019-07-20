pragma solidity ^0.5.0;
import "./SafeMath.sol";


contract SILS {
    using SafeMath for uint256;

    constructor() public { sba = msg.sender; }
    address payable sba;
    address payable[] borrowers;
    uint counter_borrower=0;
    uint256 constant minAmt = 3000000000000000000;

    mapping(string => uint) usernameMap;

    event invest(address investor, uint fund);
    event depositEvent(address contractAddress, uint contractBalance);
    event depositRule(uint256 amt, uint256 balance,uint256 borrowRatio, uint256 requiredRatio);
    event addBorrower(address borrower, address storedAddr, uint index);
    event borrowEvent(address borrower, uint fund);
    event logError(string errormsg);
    event checkDepositEvent(uint256 amt, uint256 balance,uint256 borrowRatio, uint256 requiredRatio);

    string[] errMsg = [
    "Minimum of 5 Ether",
    "Insufficient fund in contract for transfer",
    "Should not be more than 80% of your available balance",
    "Minimum Loan Amount of 3 Ether"
    ];

    //ignore this function, for testing purposes only
    function renderHelloWorld () public pure returns (string memory) {
        return "Hello World";
    }

    //ignore this function, for testing purposes only
    function deposit_fund(uint256 amt) public {

        uint256 minBalance = SafeMath.mul(SafeMath.div(msg.sender.balance,uint256(5)),uint256(4));

        emit depositRule(amt,msg.sender.balance,minBalance,amt);

        if (minBalance <= amt){
            emit logError(errMsg[2]);
        }
        if (amt <= minAmt){
            emit logError(errMsg[3]);
        }
        //emit depositRule(SafeMath.mul(SafeMath.div(amt,msg.sender.balance),10), SafeMath.mul(SafeMath.div(4,5),10));

    }

    //the same validation is applied to deposit_payable function
    function check_deposit(address payable sender, uint256 amt) public view returns (string memory){
        //uint256 minBalance = SafeMath.mul(SafeMath.div(msg.sender.balance,uint256(5)),uint256(4));
        //uint256 minBalance= msg.sender.balance;
        uint256 minBalance = SafeMath.mul(SafeMath.div(sender.balance,uint256(5)),uint256(4));
        if (amt >= minBalance){
            return errMsg[2];
        }
        else if (amt < minAmt){
            return errMsg[3];
        }
        //uint256 minBalance= sender.balance;
        return "Loan Amount Approved";

    }

    //ignore this function, for testing purposes only
    function deposit(address payable lender, uint256 amt) public  {

        //require(SafeMath.mul(SafeMath.div(msg.sender.balance,uint256(5)),uint256(4))> msg.value,  errMsg[2]);
        //require(msg.value> minAmt, errMsg[3]);
        uint256 minBalance = SafeMath.mul(SafeMath.div(msg.sender.balance,uint256(5)),uint256(4));
        //emit checkDepositEvent(msg.value,msg.sender.balance,minBalance,msg.value);

        if (amt >= minBalance){
            revert(errMsg[2]);
        }else if (amt <= minAmt){
            revert(errMsg[3]);
        }

        emit depositEvent(address(this),address(this).balance);
    }

    function deposit_payable() public payable {

        //for payable function, the require validation takes effect after amount is offset from the sender account,
        //therefore the require validation has to add (SafeMath.add) the offset balance + amount sent
        require(SafeMath.mul(SafeMath.div(SafeMath.add(msg.sender.balance,msg.value),uint256(5)),uint256(4))> msg.value,  errMsg[2]);
        require(msg.value>= minAmt, errMsg[3]);

        sba.transfer(msg.value);

        emit depositEvent(address(this),address(this).balance);
    }


    function borrow(address payable borrowerAddress, uint amt) public {

        emit borrowEvent(borrowerAddress,amt);

        borrowerAddress.transfer(amt);
        //emit invest(holder,amt);
    }

    function getBalance() public view returns(uint amt){
        return address(this).balance;
    }


}