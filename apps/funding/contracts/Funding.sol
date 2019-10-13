pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-agent/contracts/Agent.sol";
import "@aragon/os/contracts/common/IsContract.sol";


contract Funding is AragonApp {

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant SET_COIN_ROLE = keccak256("SET_COIN_ROLE");
    bytes32 public constant FUND_CAMPAIGN = keccak256("FUND_CAMPAIGN");

    string private constant ERROR_NOT_CONTRACT = "ERROR_NOT_CONTRACT";

    Agent public agent;
    address public exchangedCoin;

    enum Status {
        Open,
        Closed
    }

    struct Campaign {
        bytes32 ipfsHash;
        uint256 startingDate;
        uint256 endingDate;
        uint256 exchangeRate;
        address requestedCoin;
        address exchangedCoin;
        Status status;
    }

    event AppInitialized();
    event NewAgentSet(address indexed);
    event AgentMint();

    /**
    * @notice Initialize the Funding App
    * @param _exchangedCoin the Coin app address
    * @param _agent the Agent app address
    */
    function initialize(
        address _exchangedCoin,
        address _agent
    ) public onlyInit
    {
        require(isContract(_exchangedCoin), "Address is not a coin contract");
        require(isContract(_agent), "Address is not a coin contract");

        exchangedCoin = _exchangedCoin;
        agent = Agent(_agent);
        initialized();

        emit AppInitialized();
    }

    /**
    * @notice Update the Coin address to `_exchangedCoin`
    * @param _exchangedCoin New Coin address
    */
    function setCoin(
        address _exchangedCoin
    ) public auth(SET_COIN_ROLE)
    {
        require(isContract(_exchangedCoin), ERROR_NOT_CONTRACT);

        exchangedCoin = _exchangedCoin;
        emit NewAgentSet(_exchangedCoin);
    }

    /**
    * @notice Update the Agent address to `_agent`
    * @param _agent New Agent address
    */
    function setAgent(
        address _agent
    ) public auth(SET_AGENT_ROLE)
    {
        require(isContract(_agent), ERROR_NOT_CONTRACT);

        agent = Agent(_agent);
        emit NewAgentSet(_agent);
    }

    /**
    * @notice Ensure the returned uint256 from the _data call is 0, representing a successful call
    * @param _target Address where the action is being executed
    * @param _data Calldata for the action
    */
    function safeExecuteNoError(
        address _target,
        bytes _data,
        string memory _error
    ) internal
    {
        agent.safeExecute(_target, _data);

        uint256 callReturnValue;

        assembly {
            switch returndatasize                 // get return data size from the previous call
            case 0x20 {                           // if the return data size is 32 bytes (1 word/uint256)
                let output := mload(0x40)         // get a free memory pointer
                mstore(0x40, add(output, 0x20))   // set the free memory pointer 32 bytes
                returndatacopy(output, 0, 0x20)   // copy the first 32 bytes of data into output
                callReturnValue := mload(output)  // read the data from output
            }
            default {
                revert(0, 0) // revert on unexpected return data size
            }
        }

        require(callReturnValue == 0, _error);
    }
}
