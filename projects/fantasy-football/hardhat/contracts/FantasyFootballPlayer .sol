// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract FantasyFootballPlayer is ERC1155, Ownable, ERC1155Burnable {

    /// -----------------------------------------------------------------------
    /// Events
    /// -----------------------------------------------------------------------

    event UpdateURI(string indexed _uri);
    event UpdateMinter(address indexed _minter, bool _value);
    event UpdateBurner(address indexed _burner, bool _value);

    /// -----------------------------------------------------------------------
    /// Modifiers
    /// -----------------------------------------------------------------------

    /// @notice Throws if called by any account other than a minter.
    modifier onlyMinter() {
        require(minters[msg.sender], 'cannot mint');
        _;
    }

    /// @notice Throws if called by any account other than a burner.
    modifier onlyBurner() {
        require(burners[msg.sender], 'cannot burn');
        _;
    }

    /// -----------------------------------------------------------------------
    /// Storage variables
    /// -----------------------------------------------------------------------

    /// @notice The name of the token.
    string public constant name = 'Secure Liquid Digital Chip';
    
    /// @notice The symbol of the token.
    string public constant symbol = 'SLD';

    /// @notice Stores info pretaining to whether an account can mint players.
    /// @dev address => can mint
    mapping(address => bool) public minters;

    /// @notice Stores info pretaining to whether an account can burn players.
    /// @dev address => can burn
    mapping(address => bool) public burners;

    /// -----------------------------------------------------------------------
    /// Initialization
    /// -----------------------------------------------------------------------

    constructor(string memory _uri) ERC1155(_uri) Ownable(msg.sender) {
        emit UpdateURI(_uri);
    }


    /// -----------------------------------------------------------------------
    /// Actions
    /// -----------------------------------------------------------------------

    /// @notice Mints FantasyFootballPlayer of a single type per recipient. Only callable by a minter.
    /// @param recipients The recipients of the minted FantasyFootballPlayer.
    /// @param ids The types of FantasyFootballPlayer to mint.
    /// @param amounts The amounts of FantasyFootballPlayer to mint.
    function mint(address[] memory recipients, uint256[] memory ids, uint256[] memory amounts)
        external
        onlyMinter
    {
        uint256 length = recipients.length;
        for (uint256 i; i < length;) {
            _mint(recipients[i], ids[i], amounts[i], '');
            unchecked { ++i; }
        }
    }

    /// @notice Mints batches of FantasyFootballPlayer per recipient. Only callable by a minter.
    /// @param recipients The recipients of the minted FantasyFootballPlayer.
    /// @param ids The types of FantasyFootballPlayer to mint per batch.
    /// @param amounts The amounts of FantasyFootballPlayer to mint per batch.
    function mintBatch(address[] memory recipients, uint256[][] memory ids, uint256[][] memory amounts)
        external
        onlyMinter
    {
        uint256 length = recipients.length;
        for (uint256 i; i < length;) {
            _mintBatch(recipients[i], ids[i], amounts[i], '');
            unchecked { ++i; }
        }
    }

    /// @notice Burns a batch of FantasyFootballPlayer from single account. Only callable by a burner.
    /// @param account The owner of the FantasyFootballPlayer to burn.
    /// @param ids The types of FantasyFootballPlayer to burn.
    /// @param amounts The amounts of FantasyFootballPlayer to burn.
    function burn(address account, uint256[] memory ids, uint256[] memory amounts)
        external
        onlyBurner
    {
        _burnBatch(account, ids, amounts);
    }

    /// @notice Burns batches of FantasyFootballPlayer from multiple accounts. Only callable by a burner.
    /// @param accounts The owners of the FantasyFootballPlayer to burn.
    /// @param ids The types of FantasyFootballPlayer to burn.
    /// @param amounts The amounts of FantasyFootballPlayer to burn.
    function burnBatch(address[] memory accounts, uint256[][] memory ids, uint256[][] memory amounts)
        external
        onlyBurner
    {
        uint256 length = accounts.length;
        for (uint256 i; i < length;) {
            _burnBatch(accounts[i], ids[i], amounts[i]);
            unchecked { ++i; }
        }
    }

    /// -----------------------------------------------------------------------
    /// Setters
    /// -----------------------------------------------------------------------

    /// @notice Sets a new URI for all token types. Only callable by the owner.
    /// @param _newURI The new URI.
    function updateUri(string memory _newURI) external onlyOwner {
        _setURI(_newURI);
        emit UpdateURI(_newURI);
    }

    /// @notice Whitelists a minter account. Only callable by the owner.
    /// @param _minter The new minter account.
    function addMinter(address _minter) external onlyOwner {
        minters[_minter] = true;
        emit UpdateMinter(_minter, true);
    }

    /// @notice Deprecates a minter account. Only callable by the owner.
    /// @param _minter The old minter account.
    function removeMinter(address _minter) external onlyOwner {
        minters[_minter] = false;
        emit UpdateMinter(_minter, false);
    }

    /// @notice Whitelists a burner account. Only callable by the owner.
    /// @param _burner The new burner account.
    function addBurner(address _burner) external onlyOwner {
        burners[_burner] = true;
        emit UpdateBurner(_burner, true);
    }

    /// @notice Deprecates a burner account. Only callable by the owner.
    /// @param _burner The old burner account.
    function removeBurner(address _burner) external onlyOwner {
        burners[_burner] = false;
        emit UpdateBurner(_burner, false);
    }

}
