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
        int32[] points;
        uint created_at;
        uint updated_at;
    }

    event AfterRegistryEntityCreate(
        uint indexed _id,
        string _title,
        string _description,
        string _documents_url,
        string _image_url,
        int32[] _points,
        uint created_at
    );

    // Autoincrementer:
    uint current_id;

    function initialize() initializer public {
        current_id = 0;
    }

    // Map for storing land entries (id => land entry data).
    mapping (uint => RegistryEntity) public _registryEntity;

    // Function for creating and saving land entry to land entries map.
    function create(string memory title,
                    string memory description,
                    string memory documents_url,
                    string memory image_url,
                    int32[] memory points
    ) public {
        current_id += 1;

        uint created_at = block.timestamp;
        uint updated_at = created_at;

        RegistryEntity memory registryEntity = RegistryEntity({
            id: current_id,
            title: title,
            description: description,
            documents_url: documents_url,
            image_url: image_url,
            points: points,
            created_at: created_at,
            updated_at: updated_at
        });

        _registryEntity[current_id] = registryEntity;

        emit AfterRegistryEntityCreate(current_id, title, description, documents_url, image_url, points, created_at);
    }

    // Function for getting land entry data by land entry id.
    function find(uint id) public view returns (
        uint,
        string memory,
        string memory,
        string memory,
        string memory,
        int32[] memory,
        uint,
        uint
    ) {
        RegistryEntity memory registryEntity = _registryEntity[id];
        return (
            registryEntity.id,
            registryEntity.title,
            registryEntity.description,
            registryEntity.documents_url,
            registryEntity.image_url,
            registryEntity.points,
            registryEntity.created_at,
            registryEntity.updated_at
        );
    }

    function get_current_id() public view returns (uint) {
        return current_id;
    }

}