const Status = require("../models/status");

// Controller to create a new status
exports.createStatus = async (req, res) => {
  try {
    const newStatus = new Status(req.body);
    await newStatus.save();
    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all statuses
exports.getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProfileStatuses = async (req, res) => {
  try {
    const { id } = req.params;
    const statuses = await Status.find({ userProfileId: id });
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get a specific status by ID
exports.getStatusById = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update a status by ID
exports.likeStatus = async (req, res) => {
  try {
    const { postId, profileId } = req.body;
    let foundStatus = await Status.findOne({ _id: postId });
    if (!foundStatus) {
      return res.status(404).json({ message: "Status not found" });
    }
    if (foundStatus.likes?.length && foundStatus.likes?.includes(profileId)) {
      foundStatus.likes = foundStatus.likes.filter((e) => e != profileId);
    } else {
      foundStatus.likes = foundStatus.likes?.length
        ? [...foundStatus.likes, profileId]
        : [profileId];
    }
    const updatedStatus = await Status.findOneAndUpdate(
      {
        _id: postId,
      },
      { $set: { likes: foundStatus.likes } },

      { new: true }
    );
    res.status(200).json(updatedStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete a status by ID
exports.deleteStatusById = async (req, res) => {
  try {
    const deletedStatus = await Status.findByIdAndDelete(req.params.id);
    if (!deletedStatus) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.status(200).json({ message: "Status deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentId } = req.body;

    const foundStatus = await Status.findOne({ _id: postId });
    const newComments = foundStatus.comments.filter(
      (e) => e._id.toString() !== commentId
    );

    const updatedPost = await Status.findOneAndUpdate(
      {
        _id: postId,
      },
      { $set: { comments: newComments } },

      { new: true }
    );

    if (!foundStatus) {
      return res.status(404).json("Can't find post");
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatusById = async (req, res) => {
  try {
    const userId = req.body.userId;
    const status = await Status.findById(req.params.id);

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    const index = status.likes.indexOf(userId);

    if (index === -1) {
      status.likes.push(userId);
    } else {
      status.likes.splice(index, 1);
    }

    const updatedStatus = await status.save();

    res.status(200).json(updatedStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStatusCountById = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    const likeCount = status.likes.length;
    res.status(200).json({ likeCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.AddCommStatusById = async (req, res) => {
  try {
    const profile = req.body.profile;
    const comment = req.body.comment;
    const status = await Status.findById(req.params.id);

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    status.comments.push({ profile, commentContent: comment });
    const updatedStatus = await status.save();

    res.status(200).json(updatedStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
