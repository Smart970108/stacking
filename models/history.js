import mongoose from 'mongoose'
const Schema = mongoose.Schema

const historySchema = new Schema({
  userWallet: String,
  transaction: String,
  note: String,
}, { timestamps: true })

export default mongoose.model('history', historySchema)