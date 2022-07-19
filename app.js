// index.js
import express from "express";
import mongoose from "mongoose";
import { transferToken, transferNFT } from "./solana/index.js";
import dotenv from "dotenv";
import path from "path";
import lockedNFT from "./models/lockedNFT.js";
import stakedToken from "./models/stakedToken.js";
import historyModel from "./models/history.js";
import bodyParser from "body-parser";
import url from "url";

import axios from "axios";

// import web3, { LAMPORTS_PER_SOL, PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
// import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";

const app = express();
const __dirname = path.resolve();
dotenv.config();

app.use(express.static("client/build"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const IGUANA_EXPERIENCE = {
  Veteran: 24.2,
  Lieutenant: 15.12,
  Colonel: 9.07,
  Recruit: 7.56,
  Newbie: 6.05,
};
// comment
app.post("/stake_nft", async (req, res) => {
  if (!checkHostname(req)) {
    res.status(403).send("Invalid Origin");
    return;
  }

  const result = await stakeNFT(
    req.body.walletAddress,
    req.body.mintAddress,
    req.body.transactionAddress,
    req.body.experience
  );
  res.status(200).send({ success: result });
});

app.post("/unstake_nft", async (req, res) => {
  if (!checkHostname(req)) {
    res.status(403).send("Invalid Origin");
    return;
  }

  const result = await unstakeNFT(
    req.body.walletAddress,
    req.body.mintAddress
  );
  res.status(200).send(result);
});

app.post("/reward_token", async (req, res) => {
  if (!checkHostname(req)) {
    res.status(403).send("Invalid Origin");
    return;
  }

  const result = await rewardToken(req.body.walletAddress);
  res.status(200).send(result);
});

app.post("/staked_nfts", async (req, res) => {
  if (!checkHostname(req)) {
    res.status(403).send("Invalid Origin");
    return;
  }

  let mintAddresses = [];
  const stakedNfts = await lockedNFT.find({
    userWallet: req.body.walletAddress,
  });
  stakedNfts.map((element, index) => {
    let locked = false;
    if (Date.now() - Date.parse(element.createdAt) < process.env.LIMIT_LOCKED_TIME) {
      locked = true;
    }

    mintAddresses.push([element.nftAddress, locked]);
  });
  res.status(200).send(mintAddresses);
});

app.post("/staked_tokens", async (req, res) => {
  if (!checkHostname(req)) {
    res.status(403).send("Invalid Origin");
    return;
  }

  const stakeToken = await stakedToken.findOne({
    userWallet: req.body.walletAddress,
  });
  res.status(200).send(stakeToken);
});

app.post("/staked_nfts_count", async (req, res) => {
  if (!checkHostname(req)) {
    res.status(403).send("Invalid Origin");
    return;
  }

  const count = await lockedNFT.count();
  res.status(200).send({ count });
});

app.get("/get_iguana_stakers", async (req, res) => {
  let stakers = {}
  const nfts = await lockedNFT.find({})

  for (let i = 0; i < nfts.length; i++) {
    const elem = nfts[i];
    if (!stakers[elem.userWallet]) {
      stakers[elem.userWallet] = []
    }
    stakers[elem.userWallet].push(elem.nftAddress)
  }

  res.status(200).send(stakers);
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/client/build", "index.html"));
});

var port = normalizePort(process.env.PORT || "5000");

// Connect mongodb
mongoose.connect(process.env.MONGODB_CONNECT_URL, {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.USER_NAME,
  pass: process.env.PASSWORD,
});

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", process.env.MONGODB_CONNECT_URL);
});
db.on("error", (err) => {
  console.error("connection error:", err);
});

app.listen(port, (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log("Backend is running");
});

const stakeRewardsTimer = {};
initializeTimer();

// Initialize the stake token timer
async function initializeTimer() {
  const lockedNFTs = await lockedNFT.find();
  for (const record of lockedNFTs) {
    if (!stakeRewardsTimer[record._id]) {
      stakeRewardsTimer[record._id] = setInterval(function () {
        stakeRewards(
          record.userWallet,
          record.createdAt,
          process.env.REWARD_TOKEN_PER_LIMIT_TIME *
          IGUANA_EXPERIENCE[record.experience]
        );
      }, process.env.LIMIT_REWARD_TIME); // per reward time
    }
  }
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

async function stakeNFT(userWallet, nftAddress, transaction, experience) {
  await lockedNFT.deleteOne({
    nftAddress,
  });

  // let isExist = await lockedNFT.findOne({
  //   nftAddress,
  // });

  // if (isExist) {
  //   console.log(`${nftAddress} is exist into DB: ${isExist._id}`);
  //   return false;
  // }

  try {
    let isExist = await stakedToken.findOne({
      userWallet,
    });

    if (!isExist) {
      let newUser = new stakedToken({
        userWallet,
        tokenCnt: 0.0,
      });

      await newUser.save();
    }

    let record = new lockedNFT({
      userWallet,
      nftAddress,
      experience,
      transaction,
    });
    await record.save();

    const history = new historyModel({
      userWallet,
      transaction,
      note: `Stake NFT: ${nftAddress}`,
    });
    await history.save();

    stakeRewardsTimer[record._id] = setInterval(function () {
      stakeRewards(
        userWallet,
        record.createdAt,
        process.env.REWARD_TOKEN_PER_LIMIT_TIME * IGUANA_EXPERIENCE[experience]
      );
    }, process.env.LIMIT_REWARD_TIME); // per reward time
  } catch (err) {
    console.log(err)
    return false;
  }

  return true;
}

async function unstakeNFT(userWallet, nftAddress) {
  const isExist = await lockedNFT.findOne({
    userWallet,
    nftAddress,
  });

  if (!isExist) {
    console.log(`${userWallet}, ${nftAddress} is not exist into DB`);
    return {
      success: false,
      msg: "Cannot unstake",
    };
  }

  if (
    Date.now() - Date.parse(isExist.createdAt) <
    process.env.LIMIT_LOCKED_TIME
  ) {
    return {
      success: false,
      msg: "Cannot unstake. Limit is 7 days",
    };
  }

  try {
    const transaction = await transferNFT(nftAddress, userWallet);

    if (!transaction) {
      return {
        success: false,
        msg: "Transaction error",
      };
    }

    await lockedNFT.deleteOne({
      userWallet,
      nftAddress,
    });

    const history = new historyModel({
      userWallet,
      transaction,
      note: `Unstake NFT: ${nftAddress}`,
    });
    await history.save();

    clearInterval(stakeRewardsTimer[isExist._id]);
  } catch (err) {
    console.log(err)
    return {
      success: false,
      msg: "Transaction error",
    };
  }

  return {
    success: true,
  };
}

async function stakeRewards(userWallet, createdAt, amount) {
  const lockedAt = Date.parse(createdAt)
  const curTime = Date.parse(new Date())

  let dAmount = amount
  if (curTime - lockedAt >= 1000 * 60 * 60 * 24 * 7) { // 7 days
    dAmount += dAmount * 0.1 // 10% bonus
  }

  try {
    let isExist = await stakedToken.findOne({
      userWallet,
    });

    if (!isExist) {
      let newUser = new stakedToken({
        userWallet,
        tokenCnt: 0.0,
      });

      await newUser.save();
    }

    await stakedToken.updateOne(
      {
        userWallet,
      },
      {
        $inc: { tokenCnt: dAmount },
      }
    );
  } catch (error) {
  }
}

async function rewardToken(userWallet) {
  const isExist = await stakedToken.findOne({
    userWallet,
  });
  if (!isExist) {
    console.log(`${userWallet} is not exist into DB`);
    return {
      success: false,
      msg: "Cannot unstake",
    };
  }

  if (!isExist.tokenCnt) {
    console.log(`${userWallet} don't have any token into DB`);
    return {
      success: false,
      msg: `${userWallet} don't have any token into DB`,
    };
  }

  const tokenCnt = isExist.tokenCnt;

  const transaction = await transferToken(userWallet, tokenCnt);

  if (transaction) {
    try {
      const res = await axios.get(`https://public-api.solscan.io/transaction/${transaction}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.status === 200) {
        await stakedToken.findByIdAndUpdate(isExist._id, {
          tokenCnt: 0,
        });

        const history = new historyModel({
          userWallet,
          transaction,
          note: `Reward Token Success: ${userWallet}, ${tokenCnt}`,
        });
        await history.save();

        return {
          success: true,
          msg: `Reward Token Failed: ${userWallet}, ${tokenCnt}`,
          amount: tokenCnt,
        };
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    const history = new historyModel({
      userWallet,
      transaction,
      note: `Reward Token Failed: ${userWallet}, ${tokenCnt}`,
    });
    await history.save();
    return {
      success: false,
      msg: `Reward Token Failed: ${userWallet}, ${tokenCnt}`,
    };
  }
}

function checkHostname(req) {
  const ref = req.headers.referer;
  if (ref) {
    const u = url.parse(ref);
    console.log(u)
    console.log(u.hostname, process.env.HOSTNAME)

    return u && (u.hostname === process.env.HOSTNAME || `www.${u.hostname}` === process.env.HOSTNAME);
  }

  return false;
}