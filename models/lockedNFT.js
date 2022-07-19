import mongoose from 'mongoose'
const Schema = mongoose.Schema

const lockedNFTSchema = new Schema({
  userWallet: String,
  nftAddress: String,
  transaction: String,
  experience: String,
}, { timestamps: true })

export default mongoose.model('locked_nfts', lockedNFTSchema)