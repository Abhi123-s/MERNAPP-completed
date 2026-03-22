const mongoose = require("mongoose");
const historySchema = new mongoose.Schema({

  // The question the user typed
  prompt: {
    type: String,       
    required: true,
  },
  // The AI's answer
  response: {
    type: String,      
    required: true,
  },
  // When the question was asked
  createdAt: {
    type: Date,
    default: Date.now,  
  },
});



module.exports = mongoose.model("History", historySchema);
