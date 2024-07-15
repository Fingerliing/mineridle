// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

// Import thirdweb contracts
import "@thirdweb-dev/contracts/base/ERC1155Drop.sol"; // For my collection of Pickaxes
import "@thirdweb-dev/contracts/base/ERC20Base.sol"; // For my ERC20 Token contract
import "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/ERC1155/ERC1155Holder.sol";

// OpenZeppelin (ReentrancyGuard)
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Miner is ReentrancyGuard, ERC1155Holder {
    // Store our two other contracts (Edition drop and Token)
    ERC1155Drop public immutable pickaxeNftCollection;
    ERC20Base public immutable rewardsToken;

    // Constructor function to set the rewards token and the NFT collection addresses
    constructor(ERC1155Drop pickaxeContractAddress, ERC20Base gemsContractAddress) {
        pickaxeNftCollection = pickaxeContractAddress;
        rewardsToken = gemsContractAddress;
    }

    struct MapValue {
        bool isData;
        uint256 value;
    }

    // Mapping of player addresses to their current pickaxe
    // The player starts without pickaxe, so he won't be in the mapping
    // Mapping of address to pickaxe isn't set until they stake one
    // TokenId is the multiplier for the reward
    mapping (address => MapValue) public playerPickaxe;

    // Mapping of player address until last time they stacked/withdrew/claimed their rewards
    // By default, player hasn't any last time. They won't be in the mapping
    mapping (address => MapValue) public playerLastUpdate;

    // -- Internal -- \\

    // Calculate the rewards the player is owed since last time they were paid out
    // The rewards rate is 20,000,000 per block
    // If there aren't playerLastUpdate or playerPickaxe, the player has no rewards
    function calculateRewards(address _player) public view returns (uint256 _rewards){
        // Checking playerLastUpdate and playerPickaxe
        if(!playerLastUpdate[_player].isData || !playerPickaxe[_player].isData) {
            return 0;
        }

        // Calculate the time between now and the last time they stacked/withdrew/claimed their rewards
        uint256 timeDifference = block.timestamp - playerLastUpdate[_player].value;

        // Calculate the rewards they are owed
        uint256 rewards = timeDifference * 10_000_000_000_000 * (playerPickaxe[_player].value + 1);

        // Return the rewards
        return rewards;
    }

    function stake(uint256 _tokenId) external nonReentrant {
        // Ensure the player has at least 1 of the token they are trying to stake
        require(pickaxeNftCollection.balanceOf(msg.sender, _tokenId) >= 1, "You must have at least 1 of the pickaxe you are trying to stake");

        // If they have a pickaxe already, send it back to them
        if (playerPickaxe[msg.sender].isData) {
            // Transfer using safeTransfer
            pickaxeNftCollection.safeTransferFrom(address(this), msg.sender, playerPickaxe[msg.sender].value, 1, "Returning your old pickaxe");
        }

        //Calculate the rewards they are owed, and pay them out
        uint256 reward =calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Transfer the pickaxe tot the contract
        pickaxeNftCollection.safeTransferFrom(msg.sender, address(this), _tokenId, 1, "Stacking your pickaxe");

        // Update the playerPickaxe mapping
        playerPickaxe[msg.sender].value = _tokenId;
        playerPickaxe[msg.sender].isData = true;

        //Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].value = block.timestamp;
        playerLastUpdate[msg.sender].isData = true;
    }

    function withdraw() external nonReentrant {
        // Ensure the player has a pickaxe
        require(playerPickaxe[msg.sender].isData, "You don't have a pickaxe to withdraw.");

        // Calculate the rewards they are owed, and pay them out.
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Send the pickaxe back to the player
        pickaxeNftCollection.safeTransferFrom(address(this), msg.sender, playerPickaxe[msg.sender].value, 1, "Returning your old pickaxe");

        // Update the playerPickaxe mapping
        playerPickaxe[msg.sender].isData = false;

        // Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].isData = false;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }

    function claim() external nonReentrant {
        // Calculate the rewards they are owed, and pay them out
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].isData = false;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }
}