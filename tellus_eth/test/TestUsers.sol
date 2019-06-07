pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Users.sol";

contract TestUsers {

    function testConstructor() public {
        Users users = new Users();

        (uint user_id,
            address user_addr,
            uint user_role,
            uint user_created_at) = users.get_user(tx.origin);

        Assert.equal(
            user_id,
            1,
            "Should create default user with ID=1.");

        Assert.equal(
            user_addr,
            // First address in 'npx ganche-cli -d' environment:
            0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1,
            "Should create default user on deploying contract.");

        Assert.equal(
            user_role,
            1,
            "Should create default user with role=1 (deployer).");

        Assert.isNotZero(
            user_created_at,
            "Should create default user with created_at != 0.");
    }

    function testCreate() public {
        Users users = new Users();

        (uint user_id,
            address user_addr,
            uint user_role,
            uint user_created_at) = users.get_user(0x28a8746e75304c0780E011BEd21C72cD78cd535E);

        Assert.equal(
            user_id,
            0,
            "Not created user should return ID=0.");

        Assert.isZero(
            user_created_at,
            "Not created user should return created_at=0.");

        users.create({
            addr: 0x28a8746e75304c0780E011BEd21C72cD78cd535E,
            role: 2
        });

        (user_id,
            user_addr,
            user_role,
            user_created_at) = users.get_user(0x28a8746e75304c0780E011BEd21C72cD78cd535E);

        Assert.equal(
            user_id,
            2,
            "New created user should return ID=2.");

        Assert.isNotZero(
            user_created_at,
            "New created user should not return created_at=0.");
    }

}
