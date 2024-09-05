const User = require("../Model/UserModel");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Display all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Convert image buffers to base64
    const updatedUsers = users.map(user => ({
      ...user._doc,
      Photos: user.Photos ? {
        data: user.Photos.data.toString('base64'),
        contentType: user.Photos.contentType,
      } : null
    }));
    res.json({ users: updatedUsers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Add a new user
const addUsers = async (req, res, next) => {
  upload.single('Photos')(req, res, async (err) => {
      if (err) {
          return res.status(400).json({ message: "Error uploading file", error: err });
      }

      const { Hall_Name, Capacity, Location, Price, Hall_Type } = req.body;

      let user;
      try {
          user = new User({
              Hall_Name,
              Capacity,
              Location,
              Price,
              Hall_Type,
              Photos: {
                  data: req.file.buffer,
                  contentType: req.file.mimetype
              }
          });
          await user.save();
      } catch (err) {
          console.log(err);
          return res.status(400).json({ message: "Error adding user", error: err });
      }

      return res.status(201).json({ user });
  });
};

// Get user by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  let user;
  try {
      user = await User.findById(id);
  } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
  }

  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
};

//updateUser
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { Hall_Name, Capacity, Location, Price, Hall_Type, Photos } = req.body;

  let user;
  try {
      user = await User.findByIdAndUpdate(id, { Hall_Name, Capacity, Location, Price, Hall_Type, Photos }, { new: true });
  } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Error updating user", error: err });
  }

  if (!user) {
      return res.status(404).json({ message: "Unable to update user details" });
  }

  return res.status(200).json({ user });
};

// Delete user
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  let user;
  try {
      user = await User.findByIdAndDelete(id);
  } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
  }

  if (!user) {
      return res.status(404).json({ message: "Unable to delete" });
  }

  return res.status(200).json({ message: "User deleted successfully" });
};

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;