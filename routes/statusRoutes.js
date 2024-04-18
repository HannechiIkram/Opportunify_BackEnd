const express = require("express");
const router = express.Router();
const statusController = require("../Controllers/statusController");

// Route to create a new status
router.post("/", statusController.createStatus);

// Route to get all statuses
router.get("/", statusController.getAllStatuses);
router.get("/profile-posts/:id", statusController.getProfileStatuses);

// Route to get a specific status by ID
router.get("/:id", statusController.getStatusById);

// Route to update a status by ID
router.put("/:id", statusController.updateStatusById);

// Route to delete a status by ID
router.delete("/:id", statusController.deleteStatusById);
router.put("/comment/:postId", statusController.deleteComment);

router.post("/likepost/", statusController.likeStatus);
router.post("/likepost/count/:id", statusController.getStatusCountById);
router.post("/likepost/comm/:id", statusController.AddCommStatusById);

module.exports = router;
