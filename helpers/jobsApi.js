const axios = require("axios");
axios.defaults.baseURL = process.env.JOBS_API_URL;


exports.getJobsRequest = async ({ location, search, sort_by,page }) => {
  try {
    const response = await axios.get(
      `/`,
      {
        headers: { Authorization: `Token ${process.env.JOBS_API_KEY}` },
        params: { location, search, sort_by,page }, 
      }
    );
   
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
