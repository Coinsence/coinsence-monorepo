define({ "api": [
  {
    "type": "get",
    "url": "/coin/balance/",
    "title": "",
    "name": "GetCoinBalance",
    "group": "Coin",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "owner",
            "description": "<p>Owner address.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
          }
        ]
      }
    },
    "filename": "lib/http/apps/coin.js",
    "groupTitle": "Coin",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "balance",
            "description": "<p>in Hex.</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/coin/totalsupply/",
    "title": "",
    "name": "GetCoinTotalsupply",
    "group": "Coin",
    "version": "1.0.0",
    "filename": "lib/http/apps/coin.js",
    "groupTitle": "Coin",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "supply",
            "description": "<p>in Hex.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/coin/mint/",
    "title": "",
    "name": "PostCoinMint",
    "group": "Coin",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "recipient",
            "description": "<p>Recipient address.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>Coin amount.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
          }
        ]
      }
    },
    "filename": "lib/http/apps/coin.js",
    "groupTitle": "Coin",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "txHash",
            "description": "<p>Transaction hash.</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/coin/transfer/",
    "title": "",
    "name": "PostCoinTransfer",
    "group": "Coin",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to",
            "description": "<p>Recipient address.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>Coin amount.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
          }
        ]
      }
    },
    "filename": "lib/http/apps/coin.js",
    "groupTitle": "Coin",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Object",
            "optional": false,
            "field": "transaction",
            "description": "<p>Transaction.</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/dao/",
    "title": "",
    "name": "PostDao",
    "group": "Dao",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "spaceName",
            "description": "<p>Space name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "descHash",
            "description": "<p>IPFS hash</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "coinName",
            "description": "<p>Coin name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "coinSymbol",
            "description": "<p>Coin symbol</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "coinDecimals",
            "description": "<p>Coin decimals</p>"
          },
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
    "filename": "lib/http/apps/dao.js",
    "groupTitle": "Dao",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "txHash",
            "description": "<p>Transaction hash.</p>"
          },
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "daoAddress",
            "description": "<p>DAO address.</p>"
          },
          {
            "group": "201",
            "type": "String[]",
            "optional": false,
            "field": "Apps",
            "description": "<p>instances.</p>"
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
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/space/",
    "title": "",
    "name": "GetSpace",
    "group": "Space",
    "version": "1.0.0",
    "filename": "lib/http/apps/space.js",
    "groupTitle": "Space",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String[]",
            "optional": false,
            "field": "Addresses",
            "description": "<p>ACL and Coin app addresses.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/space/getmemberscount",
    "title": "",
    "name": "GetSpaceMembersCount",
    "group": "Space",
    "version": "1.0.0",
    "filename": "lib/http/apps/space.js",
    "groupTitle": "Space",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Number",
            "optional": false,
            "field": "Space",
            "description": "<p>members count.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/space/owner",
    "title": "",
    "name": "GetSpaceOwner",
    "group": "Space",
    "version": "1.0.0",
    "filename": "lib/http/apps/space.js",
    "groupTitle": "Space",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "Space",
            "description": "<p>owner address.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/space/leave",
    "title": "",
    "name": "PostSpaceLeave",
    "group": "Space",
    "version": "1.0.0",
    "filename": "lib/http/apps/space.js",
    "groupTitle": "Space",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "txHash",
            "description": "<p>Transaction hash.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/space/addMembers",
    "title": "",
    "name": "PostSpaceMembers",
    "group": "Space",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "members",
            "description": "<p>List of members addresses</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Accounts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dao",
            "description": "<p>Dao address</p>"
          }
        ]
      }
    },
    "filename": "lib/http/apps/space.js",
    "groupTitle": "Space",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "txHash",
            "description": "<p>Transaction hash.</p>"
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
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingDaoError",
            "description": "<p>dao address is missing.</p>"
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
          "title": "Bad Request response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error\": \"dao is missing\"\n}",
          "type": "json"
        }
      ]
    }
  },
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
          "content": "HTTP 404 Not Found\n{\n  \"error\": \"Could not load wallet\"\n}",
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
