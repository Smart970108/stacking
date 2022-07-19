import mongoose from 'mongoose'
const Schema = mongoose.Schema

const stakedTokenSchema = new Schema({
  userWallet: String,
  tokenCnt: Number,
}, { timestamps: true })

export default mongoose.model('staked_token', stakedTokenSchema)