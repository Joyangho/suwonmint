const Network = 5;

(async () => {
    setMintCount();
})();

var WalletAddress = "";
var WalletBalance = "";

async function connectWallet(){
    if(window.ethereum){
        await window.ethereum.send('eth_requestAccounts');
        window.web3 = new Web3(window.ethereum);
        //Check network
        if(window.web3._provider.networkVersion != Network){
          alert("Please connect correct network","","warning");
        }
        
        //Get Account information
        var accounts = await web3.eth.getAccounts();
        WalletAddress = accounts[0];
        WalletBalance = await web3.eth.getBalance(WalletAddress);

        if(web3.utils.fromWei(WalletBalance) < 0.0001){
            alert("You need more Ethereum");
        }else{
            document.getElementById("txtWalletAddress").innerHTML = WalletAddress;
            document.getElementById("txtWalletBalance").innerHTML = web3.utils.fromWei(WalletBalance);
            document.getElementById("walletInfo").style.display = "block";
            document.getElementById("btnConnectWallet").style.display = "none";
        }
    }
}

async function setMintCount(){
    await window.ethereum.send('eth_requestAccounts');
    window.web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(ABI, ADDRESS);
    
    if(contract){
        var totalSupply = await contract.methods.totalSupply().call();
        document.getElementById("txtTotalSupply").innerHTML = totalSupply;
        var totalSupply = await contract.methods.maxSupply().call();
        document.getElementById("txtMaxSupply").innerHTML = totalSupply;
    }
}

function btnMintAmount(type){
    var amount = document.getElementById("txtMintAmount").innerHTML * 1;
    console.log(amount);
    switch(type){
        case "minus":
            if(amount > 1){
                amount -= 1;
                document.getElementById("txtMintAmount").innerHTML = amount;
            }
            break;
        case "plus":
            if(amount < 10){
                amount += 1;
                document.getElementById("txtMintAmount").innerHTML = amount;
            }
            break;
    }
}

async function mint(){
    await window.ethereum.send('eth_requestAccounts');
    window.web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(ABI, ADDRESS);
    
    if(contract){
        var mintAmount = document.getElementById("txtMintAmount").innerHTML;
        var transaction = await contract.methods.Publicmint(mintAmount).send(
            { from : WalletAddress,
              value : 0.0001 * mintAmount * 10 ** 18
            }).on('error',function(error){
                alert("Mint error!");
                console.log("Mint - Error : " + error);
            }).then(function(receipt){
                alert("Mint Success!");
                console.log("Mint - success : " + receipt);
          });
        console.log("Mint - transaction : " + transaction);
    }   
}