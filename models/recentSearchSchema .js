const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Recent Search
const recentSearchSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the user who made the search
  query: { type: String, required: true }, // The search query
  createdAt: { type: Date, default: Date.now, index: { expires: '30d' } }, // TTL for automatic cleanup after 30 days
});

// Schema for Recent Page
const recentPageSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the user who visited the page
  pageUrl: { type: String, required: true }, // URL of the page visited
  createdAt: { type: Date, default: Date.now, index: { expires: '30d' } }, // TTL for automatic cleanup after 30 days
});

// Adding indexes to improve query performance
recentSearchSchema.index({ userId: 1, createdAt: -1 }); // Index for quick retrieval of recent searches
recentPageSchema.index({ userId: 1, createdAt: -1 }); // Index for quick retrieval of recent pages

const RecentSearch = mongoose.model('RecentSearch', recentSearchSchema);
const RecentPage = mongoose.model('RecentPage', recentPageSchema);

module.exports = { RecentSearch, RecentPage };
