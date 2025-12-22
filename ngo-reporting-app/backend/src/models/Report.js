import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  ngoId: String,
  month: String,
  peopleHelped: Number,
  eventsConducted: Number,
  fundsUtilized: Number
});

reportSchema.index({ ngoId: 1, month: 1 }, { unique: true });

export default mongoose.model("Report", reportSchema);
