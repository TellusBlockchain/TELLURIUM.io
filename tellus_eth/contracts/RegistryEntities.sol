pragma solidity >=0.4.0 <0.7.0;

import "zos-lib/contracts/Initializable.sol";

// Contract for managing land entries.
contract RegistryEntities is Initializable {

    // Struct for storing data of land entry.
    struct RegistryEntity {
        uint id;
        string title;
        string description;
        string documents_url;
        string image_url;
        string priceUSD;
        int32[] points;
        uint created_at;
        uint updated_at;
    }

    event AfterRegistryEntityCreated(
        uint indexed _id,
        string _title,
        string _description,
        string _documents_url,
        string _image_url,
        string priceUSD,
        int32[] _points,
        uint _created_at,
        address _creator_addr
    );

    // Autoincrementer:
    uint current_id;

    function initialize() public initializer {
        current_id = 0;
    }

    // Map for storing land entries (id => land entry data).
    mapping (uint => RegistryEntity) public _registryEntities;

    // Function for creating and saving land entry to land entries map.
    function create(string memory title,
                    string memory description,
                    string memory documents_url,
                    string memory image_url,
                    string memory priceUSD,
                    int32[] memory points
    ) public payable {
        require(
            msg.value >= 0.1 ether,
            "Not enough Ether provided."
        );

        current_id += 1;

        uint created_at = block.timestamp;
        uint updated_at = created_at;

        RegistryEntity memory registryEntity = RegistryEntity({
            id: current_id,
            title: title,
            description: description,
            documents_url: documents_url,
            image_url: image_url,
            priceUSD: priceUSD,
            points: points,
            created_at: created_at,
            updated_at: updated_at
        });

        _registryEntities[current_id] = registryEntity;

        emit AfterRegistryEntityCreated(
            current_id,
            title,
            description,
            documents_url,
            image_url,
            priceUSD,
            points,
            created_at,
            tx.origin
        );
    }

    // Function for getting land entry data by land entry id.
    function find(uint id) public view returns (
        uint,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        int32[] memory,
        uint,
        uint
    ) {
        RegistryEntity memory registryEntity = _registryEntities[id];
        return (
            registryEntity.id,
            registryEntity.title,
            registryEntity.description,
            registryEntity.documents_url,
            registryEntity.image_url,
            registryEntity.priceUSD,
            registryEntity.points,
            registryEntity.created_at,
            registryEntity.updated_at
        );
    }

    function get_current_id() public view returns (uint) {
        return current_id;
    }

}