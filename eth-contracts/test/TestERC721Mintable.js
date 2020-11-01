var CapstonkenERC721Token = artifacts.require('CapstonkenERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CapstonkenERC721Token.new({from: account_one});

            // TODO: mint multiple tokens
            this.contract.mint(account_one, 1, { from: account_one });
            this.contract.mint(account_one, 2, { from: account_one });
            this.contract.mint(account_two, 3, { from: account_one });
        })

        it('should return total supply', async function () { 
            assert.equal(3, this.contract.totalSupply(), "There should be three tokens minted.");
        })

        it('should get token balance', async function () { 
            assert.equal(2, this.contract.balanceOf(account_one).call(), "Account_one should have two tokens on its own.");
            assert.equal(1, this.contract.balanceOf(account_two).call(), "Account_two should have one token on its own.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", this.contract.tokenURI(1).call(), "URI of token with ID = 1 is not correct.");
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", this.contract.tokenURI(2).call(), "URI of token with ID = 2 is not correct.");
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3", this.contract.tokenURI(3).call(), "URI of token with ID = 3 is not correct.");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 2);
            assert.equals(account_one, this.contract.ownerOf(1).call(), "Oner of token with ID = 1 is not correct.");
            assert.equals(account_two, this.contract.ownerOf(2).call(), "Oner of token with ID = 2 is not correct.");
            assert.equals(account_two, this.contract.ownerOf(3).call(), "Oner of token with ID = 3 is not correct.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            let accessDenied = false;
            try  {
                await this.contract.mint(account_one, 4, { from: account_two });
            } catch(e) {
                accessDenied = true;
            }
            assert.equal(accessDenied, true, "Mint action not authorized for this account.");
            assert.equal(false, this.contract._exists(4).call(), "Token with ID = 4 should not be registered.");
        })

        it('should return contract owner', async function () { 
            assert.equals(account_one, this.contract.getOwner().call(), "The contract owner shold be account_one.");
        })

    });
})