pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RegistryEntities.sol";

contract TestRegistryEntities {
    uint public initialBalance = 10 ether;

    function testCreate() public {
        RegistryEntities registryEntities = new RegistryEntities();
        registryEntities.initialize();

        int32 valid_x = 1;
        int32 valid_y = 2;
        int32 valid_z = 3;

        int32[] memory points = new int32[](3);
        points[0] = valid_x;
        points[1] = valid_y;
        points[2] = valid_z;

        registryEntities.create.value(100000000000000000)({
            title: "title",
            description: "description",
            documents_url: "documents_url",
            image_url: "image_url",
            priceUSD: "5000.00",
            points: points
        });
    }

    function testFind() public {
        RegistryEntities registryEntities = new RegistryEntities();
        registryEntities.initialize();

        int32[] memory points = new int32[](3);
        points[0] = 1;
        points[1] = 2;
        points[2] = 3;

        registryEntities.create.value(100000000000000000)({
            title: "title",
            description: "description",
            documents_url: "documents_url",
            image_url: "image_url",
            priceUSD: "5000.00",
            points: points
        });

        (
            uint id1,
            string memory title1,
            string memory description1,
            string memory documents_url1,
            string memory image_url1,
            string memory priceUSD1,
            int32[] memory points1,
            uint created_at1,
            uint updated_at1
        ) = registryEntities.find(1);

        Assert.equal(id1, 1, "Id1 should be 1.");
        Assert.equal(title1, "title", "Title1 should be 'title'.");
        Assert.equal(description1, "description", "Description1 should be 'description'.");
        Assert.equal(documents_url1, "documents_url", "Documents_url1 should be 'documents_url'.");
        Assert.equal(image_url1, "image_url", "Image_url1 should be 'image_url'.");
        Assert.equal(priceUSD1, "5000.00", "priceUSD1 should be '5000.00'.");
        Assert.equal(points1[0], 1, "Points1[0] should be 1.");
        Assert.equal(points1[1], 2, "Points1[1] should be 2.");
        Assert.equal(points1[2], 3, "Points1[2] should be 3.");
        Assert.isAbove(created_at1, 0, "Created_at1 should be greater than 0.");
        Assert.isAbove(updated_at1, 0, "Updated_at1 should be greater than 0.");
    }

    function testGetCurrentId() public {
        RegistryEntities registryEntities = new RegistryEntities();
        registryEntities.initialize();

        int32[] memory points = new int32[](3);
        points[0] = 1;
        points[1] = 2;
        points[2] = 3;

        registryEntities.create.value(100000000000000000)({
            title: "title",
            description: "description",
            documents_url: "documents_url",
            image_url: "image_url",
            priceUSD: "5000.00",
            points: points
        });

        Assert.equal(registryEntities.get_current_id(), 1, "Current Id of registryEntities should be 1.");

    }

}
