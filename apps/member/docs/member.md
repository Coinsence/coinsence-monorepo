## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| contracts/Member.sol | 5fd84b3035bede968456e4d3b1c17b457cc06e5c |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **Member** | Implementation | AragonApp |||
| └ | initialize | Public ❗️ | 🛑  | onlyInit |
| └ | addMember | Public ❗️ | 🛑  | isInitialized |
| └ | updateMemberAccount | Public ❗️ | 🛑  | isInitialized |
| └ | updateMemberIpfsHash | Public ❗️ | 🛑  | isInitialized |
| └ | addressExists | Public ❗️ |   |NO❗️ |
| └ | exists | Public ❗️ |   |NO❗️ |
| └ | getContributorIdByAddress | Public ❗️ |   |NO❗️ |
| └ | getContributorAddressById | Public ❗️ |   |NO❗️ |
| └ | getMemberById | Public ❗️ |   |NO❗️ |
| └ | getMemberByAddress | Internal 🔒 |   | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
