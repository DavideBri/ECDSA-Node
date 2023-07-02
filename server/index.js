const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "b6d43001fbd693308e3429041d00c01433a9d46d3468a67d968aa10ae010b45a": 100, // 8be7b631e1dfae9446cdd71e51975344dc53885c0cd056ec84dba44f66b3bdf9
  "f7c82d3550f788d23a1e10b2bc0607d8f3f7514b679257b4166ccf36ab76322b": 50, // c564bbec3168f654a61d8f5f89045aaa6f2f3af4945c9184d90301dd345dee24
  "2a130c68221ae4a06308bab502dd8b4eb91114fbbf3fdce6c4858a7279188ed0": 75, // dd4402d72d8abcce0f00daa00ea5ddc713cf7dc69708d7fb58a8148079c56b74
  "013fa8cfe5d89b58c27d6461f201ba9f757d73d9": 10000
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
