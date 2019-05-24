pragma solidity >=0.4.0 <0.7.0;

contract Users {

    struct User {
        uint id;
        address addr;
    }

    // Autoincrementer:
    uint current_id = 0;

    mapping(address => User) public _users;

    function create(address addr) public {
        current_id++;

        User memory user = User({
            id: current_id,
            addr: addr
        });

        _users[addr] = user;
    }

}