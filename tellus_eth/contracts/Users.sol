pragma solidity >=0.4.0 <0.7.0;

contract Users {

    struct User {
        uint id;
        address addr;
        uint role;
        uint created_at;
    }

    constructor () public {
        // Create first user on init with role=1 (deployer)
        create(tx.origin, 1);
    }

    // Autoincrementer:
    uint current_id = 0;

    mapping (address => User) public _users;

    // Method for creating new user and adding it to list of users
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