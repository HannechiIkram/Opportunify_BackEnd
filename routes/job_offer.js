const express = require("express");
const router = express.Router();
const userController = require("../Controllers/job-offerController");

const job_offerModel = require("../models/job_offer");

// [UPDATE]
router.put("/update/:id", async function (req, res) {
    try {
      const updatedjob_offer = await job_offerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedjob_offer) {
        return res.status(404).json({ error: 'job_offer not found' });
      }
      res.status(200).json(updatedjob_offer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//  [DELETE] 
router.delete("/delete/:id", async function (req, res) {
    try {
      const deletedjoboffer = await job_offerModel.findOneAndDelete({ _id: req.params.id });
      if (!deletedjoboffer) {
        return res.status(404).json({ error: 'job_offer  not found' });
      }
      res.status(200).json({ message: 'job_offer deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


    // Search based on the title
    router.get("/search/title/:title", async function (req, res) {
        try {
          const title = req.params.title;
          const joboffers = await job_offerModel.find({ title });
          res.json(joboffers);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

router.get("/getall", userController.getall);

router.get("/get/:id", userController.getbyid);
router.post("/add", userController.add);



module.exports = router;
