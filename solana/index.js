import web3, { LAMPORTS_PER_SOL } from '@solana/web3.js'
import splToken from '@solana/spl-token'

export const transferToken = async (toPubKey, amount) => {
  try {
    const connection = new web3.Connection(web3.clusterApiUrl(process.env.SOLANA_NETWORK), 'confirmed');

    const fromWallet = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.LOCKED_WALLET_PRIVATE_KEY)));
    const token = await new splToken.Token(
      connection,
      new web3.PublicKey(process.env.TOKEN_ADDRESS),
      splToken.TOKEN_PROGRAM_ID,
      fromWallet
    );
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      fromWallet.publicKey
    );
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      new web3.PublicKey(toPubKey),
    );

    var transaction = new web3.Transaction().add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        amount * LAMPORTS_PER_SOL,
      ),
    ).add(new web3.TransactionInstruction({
      keys: [],
      programId: new web3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from("Reward token for staking"),
    }));

    let signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromWallet],
      { commitment: 'confirmed' },
    );

    return signature;

  } catch (error) {
    return false;
  }
}

export const transferNFT = async (mintAddress, toPubKey) => {
  try {
    const connection = new web3.Connection(web3.clusterApiUrl(process.env.SOLANA_NETWORK), 'confirmed');

    var fromWallet = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.LOCKED_WALLET_PRIVATE_KEY)));

    let token = await new splToken.Token(
      connection,
      new web3.PublicKey(mintAddress),
      splToken.TOKEN_PROGRAM_ID,
      fromWallet
    );

    let fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      fromWallet.publicKey
    )

    let toTokenAccount = await token.getOrCreateAssociatedAccountInfo(
      new web3.PublicKey(toPubKey),
    );

    var transaction = new web3.Transaction().add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        1,
      ),
    ).add(new web3.TransactionInstruction({
      keys: [],
      programId: new web3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from("Unstake NFT"),
    }));

    let signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromWallet],
      { commitment: 'confirmed' },
    );

    return signature;

  } catch (error) {
    return false;
  }
}