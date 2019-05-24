pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Users.sol";

contract TestUsers {

    function testCreate() public {
        Users users = new Users();
        users.create({ addr: 0x2af4978cA29Dfe3D402b76Ec946785f1E84Ed82c });
    }

}
