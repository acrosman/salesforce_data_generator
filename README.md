# Salesforce Data Generator

This is a simple proof-of-concept level project to generate SalesforceDX importable JSON data plans from Metadata via a simple Node application.

## Project Setup

To get starting using and extending this tool the follow setup is required:
1. Install and setup node.js and npm.
2. Run `npm install` in the project root to load all required node modules.
3. Have access to an org at Salesforce, with Username, Password, and Security Token. If you do not know how to find the security token follow these directions. https://help.salesforce.com/articleView?id=user_security_token.htm&type=5

Currently this tool does not make any changes to the org, but it is still best to use it with a sandbox or developer org as it is largely an experimental tool.

## Running Commands

At the moment this tool just pulls information from metadata to get object descriptions (hopefully that will change soon). To run the app run: `node index.js` from the project root.  You will be asked for your username, and password with security token (the expected value here is the two concatiated). From there the interface will ask any additional questions to run further commands.
