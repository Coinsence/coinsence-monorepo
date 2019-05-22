define({ "api": [
  {
    "type": "get",
    "url": "/wallet/",
    "title": "",
    "name": "GetWallet",
    "group": "Wallet",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          }
        ]
      }
    },
    "filename": "lib/http/apps/wallet.js",
    "groupTitle": "Wallet",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the wallet.</p>"
          },
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "balanceWei",
            "description": "<p>Address balance in Wei unit.</p>"
          },
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "balanceEther",
            "description": "<p>Address balance in Ether.</p>"
          },
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "balanceHex",
            "description": "<p>Address balance in Hexadecimal.</p>"
          },
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "transactionCount",
            "description": "<p>Number of transaction from that address.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "MissingAccountId",
            "description": "<p>User account ID is missing.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>could not load user wallet.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"accountId is missing\"\n}",
          "type": "json"
        },
        {
          "title": "Not Found response:",
          "content": "HTTP 400 Not Found\n{\n  \"error\": \"Could not load wallet\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/wallet/",
    "title": "",
    "name": "PostWallet",
    "group": "Wallet",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          }
        ]
      }
    },
    "filename": "lib/http/apps/wallet.js",
    "groupTitle": "Wallet",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the wallet.</p>"
          },
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "mnemonic",
            "description": "<p>Mnemonic of the wallet.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "MissingAccountId",
            "description": "<p>User account ID is missing.</p>"
          }
        ],
        "409": [
          {
            "group": "409",
            "optional": false,
            "field": "ExistantWallet",
            "description": "<p>User account already have a wallet.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServer",
            "description": "<p>The server encountered an unexpected condition that prevented it from fulfilling the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"accountId is missing\"\n}",
          "type": "json"
        },
        {
          "title": "Conflict response:",
          "content": "HTTP 409 Conflict\n{\n  \"error\": \"account already has a wallet\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
