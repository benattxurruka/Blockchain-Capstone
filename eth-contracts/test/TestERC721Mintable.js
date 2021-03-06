var RealestokenERC721Token = artifacts.require('RealestokenERC721Token');

contract('Real Estate ERC721Token tests', accounts => {

    let contract;
    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            contract = await RealestokenERC721Token.new({from: account_one});

            // TODO: mint multiple tokens
            await contract.mint(account_one, 1, { from: account_one });
            await contract.mint(account_one, 2, { from: account_one });
            await contract.mint(account_two, 3, { from: account_one });
        })

        it('should return total supply', async function () { 
            let totalSupply = await contract.totalSupply.call();
            assert.equal(3, totalSupply, "There should be three tokens minted.");
        })

        it('should get token balance', async function () { 
            let balanceOne = await contract.balanceOf.call(account_one);
            assert.equal(2, balanceOne, "Account_one should have two tokens on its own.");
            let balanceTwo = await contract.balanceOf.call(account_two);
            assert.equal(1, balanceTwo, "Account_two should have one token on its own.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenUriOne = await contract.tokenURI.call(1);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", tokenUriOne, "URI of token with ID = 1 is not correct.");
            let tokenUriTwo = await contract.tokenURI.call(2);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", tokenUriTwo, "URI of token with ID = 2 is not correct.");
            let tokenUriThree = await contract.tokenURI.call(3);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3", tokenUriThree, "URI of token with ID = 3 is not correct.");
        })

        it('should transfer token from one owner to another', async function () { 
            
            try 
            {
                await contract.transferFrom(account_one, account_two, 2, { from: account_one });
            }
            catch(e) {
                console.log('TransferFrom failed.', e);
            }
            let ownerOfOne = await contract.ownerOf.call(1);
            assert.equal(account_one, ownerOfOne, "Oner of token with ID = 1 is not correct.");
            let ownerOfTwo = await contract.ownerOf.call(2);
            assert.equal(account_two, ownerOfTwo, "Oner of token with ID = 2 is not correct.");
            let ownerOfThree = await contract.ownerOf.call(3);
            assert.equal(account_two, ownerOfThree, "Oner of token with ID = 3 is not correct.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            contract = await RealestokenERC721Token.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            let accessDenied = false;
            try  {
                await contract.mint(account_one, 4, { from: account_two });
            } catch(e) {
                accessDenied = true;
            }
            assert.equal(true, accessDenied, "Mint action not authorized for this account.");
            let balanceTwo = await contract.balanceOf.call(account_two);
            assert.equal(0, balanceTwo, "Account_two should have zero token on its own.");
        })

        it('should return contract owner', async function () { 
            let owner = await contract.getOwner.call();
            assert.equal(account_one, owner, "The contract owner shold be account_one.");
        })

    });
})