## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| Coin.sol | 8edf988b88894a7eb02b9a3f340f1a03162b0776 |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **Coin** | Implementation | StandardCoin, AragonApp |||
| └ | initialize | Public ❗️ | 🛑  | onlyInit |
| └ | name | Public ❗️ |   | isInitialized |
| └ | symbol | Public ❗️ |   | isInitialized |
| └ | decimal | Public ❗️ |   | isInitialized |
| └ | issueCoin | Public ❗️ | 🛑  | isInitialized auth |
| └ | mintCoin | Public ❗️ | 🛑  | isInitialized auth |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
