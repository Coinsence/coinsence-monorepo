## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| Space.sol | e5849afd29cbc79a4870e5cd6622949dcc4a3274 |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **Space** | Implementation | AragonApp |||
| └ | initialize | Public ❗️ | 🛑  | onlyInit |
| └ | getMembersCount | Public ❗️ |   | isInitialized |
| └ | addMembers | Public ❗️ | 🛑  | isInitialized auth |
| └ | leaveSpace | Public ❗️ | 🛑  | isInitialized |
| └ | verifyMembers | Internal 🔒 |   | |
| └ | setAsMembers | Internal 🔒 | 🛑  | onlyInit |
| └ | getMemberAddressPosition | Internal 🔒 |   | isInitialized |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
