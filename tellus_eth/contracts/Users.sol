pragma solidity >=0.4.0 <0.7.0;

import "zos-lib/contracts/Initializable.sol";

/// @title Tellus Title users smart contract
/// @author Yuriy Kashnikov <yuriy@ubikgroup.co>
/// @notice A class for managing Tellus Title users

contract Users is Initializable {

    struct User {
        uint id;
        address addr;
        uint role;
        uint created_at;
    }

    event AfterUserCreate(
        uint indexed _id,
        address _addr,
        uint _role,
        uint created_at
    );

    // Autoincrementer:
    uint current_id;

    function initialize() public initializer {
        current_id = 0;

        // Create first user on init with role=1 (deployer)
        create(tx.origin, 1);
    }

    mapping (address => User) public _users;

    /// @notice Method for creating new user and adding it to list of users
    /// @param addr The Ethereum address of user
    /// @param role The role of new user:
    /// 0 – not choosen
    /// 1 – deployer
    /// 2 – notary
    /// 3 – ordinary user

    function create (address addr, uint role) public {
        User memory user = _users[addr];

        require(
            user.created_at == 0,
            "User should not be created earlier."
        );

        current_id++;

        user = User({
            id: current_id,
            addr: addr,
            role: role,
            created_at: block.timestamp
        });

        _users[addr] = user;

        emit AfterUserCreate(current_id, addr, role, block.timestamp);
    }

    function get_my_role() public view returns (uint) {
        User memory user = _users[tx.origin];
        return user.role;
    }

    function get_user(address addr) public view returns (uint256, address, uint256, uint256) {
        User memory user = _users[addr];
        return (user.id, user.addr, user.role, user.created_at);
    }
}