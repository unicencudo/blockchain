pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SILS.sol";

contract TestAdoption {
    // The address of the adoption contract to be tested
    AccessControl control = AccessControl(DeployedAddresses.AccessControl());

    //The expected owner of adopted pet is this contract
    address owner = address(this);

    function testHelloWord() public {
        string memory result = control.renderHelloWorld();

       Assert.equal(result, "Hello World", "Result should match what is returned.");
    }

}