pragma solidity >=0.4.0 <0.7.0;

// Contract for managing land entries.
contract LandEntries {

    // Struct for storing data of land entry.
    struct LandEntry {
        uint id;
        string title;
        string description;
        string documents_url;
        string image_url;
        int32[] points;
        uint created_at;
        uint updated_at;
    }

    // Autoincrementer:
    uint current_id = 0;

    // Map for storing land entries (id => land entry data).
    mapping(uint => LandEntry) public _landEntries;

    // Function for creating and saving land entry to land entries map.
    function create(string memory title,
                    string memory description,
                    string memory documents_url,
                    string memory image_url,
                    int32[] memory points
    ) public {
        current_id += 1;

        uint created_at = now;
        uint updated_at = created_at;

        LandEntry memory landEntry = LandEntry({
            id: current_id,
            title: title,
            description: description,
            documents_url: documents_url,
            image_url: image_url,
            points: points,
            created_at: created_at,
            updated_at: updated_at
        });

        _landEntries[current_id] = landEntry;
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
        LandEntry memory landEntry = _landEntries[id];

        return (
            landEntry.id,
            landEntry.title,
            landEntry.description,
            landEntry.documents_url,
            landEntry.image_url,
            landEntry.points,
            landEntry.created_at,
            landEntry.updated_at
        );
    }

}