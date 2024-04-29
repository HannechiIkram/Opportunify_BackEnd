const { getJobsRequest } = require("../helpers/jobsApi");

exports.getJobs = async (req, res) => {
  try {
    const { location, search, sort_by, page } = req.query;
    const limit = 5;
    const skip = page - 1;
    let data = await getJobsRequest({ location, search, sort_by });
    if (data.results.length === 0) {
      data = await getJobsRequest({ location: search, search: "", sort_by });
    }
    const result = data.results.slice(skip * limit, skip * limit + limit);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
