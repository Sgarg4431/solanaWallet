import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import * as buffer from "buffer";
import { useEffect, useState } from "react";

function App() {
  window.Buffer = buffer.Buffer;
  const web3 = require("@solana/web3.js");
  const cluster_url = "https://api.testnet.solana.com";
  const bs58 = require("bs58");
  const [account, setAccount] = useState();
  const [pub, setPub] = useState();
  const [pri, setPri] = useState();
 
  const web3Handler = async () => {
    const response = await window.solana.connect({ onlyIfTrusted: true });
    console.log(
      'Connected with Public Key:',
      response.publicKey.toString()
    );
    setAccount(response.publicKey.toString());
  };
 
  const style1 = {
    paddingLeft: "800px",
    display: "inline-block",
  };
  const style2 = {
    paddingLeft: "5px",
    display: "inline-block",
  };
  const generateKeys = async () => {
    const connection = new web3.Connection(cluster_url, "confirmed");
    //create keys
    const wallet = await web3.Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      2 * web3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    setPub(wallet.publicKey);
    setPri(wallet.secretKey);
    alert(
      "Public key: " +
        wallet.publicKey.toString() +
        " " +
        "Private Key: " +
        bs58.encode(wallet.secretKey)
    );
    console.log(wallet.publicKey.toString());
    console.log(
      "SOL balance of minter",
      await connection.getBalance(wallet.publicKey)
    );
  };
  const tranfer = async () => {
    const connection = new web3.Connection(cluster_url, "confirmed");
    let wallet = web3.Keypair.fromSecretKey(pri);
    console.log(account);
    console.log(pub.toString());
    console.log(wallet);
    console.log(
      "SOL balance before",
      await connection.getBalance(wallet.publicKey)
    );
    const toPublicKey = new web3.PublicKey(account);
    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: toPublicKey,
        lamports: 0.1* web3.LAMPORTS_PER_SOL,
      })
    );
    var signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet]
    );
  console.log(signature);
  console.log(
    "SOL balance after",
    await connection.getBalance(wallet.publicKey)
  );
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/logo192.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />{" "}
            <h1 style={style2}>Soalna Wallet</h1>
            <h3 style={style1}>
              {account ? (
                <button>
                  {account.slice(0, 5) + "....." + account.slice(38, 42)}
                </button>
              ) : (
                <button onClick={web3Handler}>Connect wallet</button>
              )}
            </h3>
            <br></br>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Card>
        <Card.Body>
          <Card.Title>Generate Keys</Card.Title>

          <br></br>
          <Card.Text>
            <Button onClick={generateKeys}>Generate</Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Transfer</Card.Title>

          <br></br>
          <Card.Text>
            <Button onClick={tranfer}>Transfer</Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default App;
