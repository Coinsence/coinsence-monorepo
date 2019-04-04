## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| CoinsenceKit.sol | 33786a37583f0c9a9d772bd2a9b4cfee81547e8b |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **KitBase** | Implementation | APMNamehash |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | latestVersionAppBase | Public ❗️ |   |NO❗️ |
| └ | handleCleanupPermissions | Internal 🔒 | 🛑  | |
| └ | cleanupPermission | Internal 🔒 | 🛑  | |
||||||
| **CoinsenceKit** | Implementation | KitBase |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | KitBase |
| └ | newInstance | Public ❗️ | 🛑  |NO❗️ |
| └ | createCSApps | Internal 🔒 | 🛑  | |
| └ | initializeCSApps | Internal 🔒 | 🛑  | |
| └ | handleCSPermissions | Internal 🔒 | 🛑  | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
