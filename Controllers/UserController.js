const User = require("../Model/UserModel");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Display all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
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

    try {
      const user = new User({
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
      return res.status(201).json({ user });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Error adding user", error: err });
    }
  });
};

// Get user by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { Hall_Name, Capacity, Location, Price, Hall_Type, Photos } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { Hall_Name, Capacity, Location, Price, Hall_Type, Photos }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "Unable to update user details" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error updating user", error: err });
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Unable to delete" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user status
const updateUserStatus = async (req, res, next) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Error updating hall status" });
  }
};

// Generate report
const generateReport = async (req, res) => {
  try {
    const halls = await User.find({}, '-Photos');
    
    const csvRows = [
      ['Hall Name', 'Capacity', 'Location', 'Price', 'Hall Type', 'Status'],
      ...halls.map(hall => [
        hall.Hall_Name,
        hall.Capacity,
        hall.Location,
        hall.Price,
        hall.Hall_Type,
        hall.status || 'Available'
      ])
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=halls_report.csv');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ message: "Error generating report", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  addUsers,
  getById,
  updateUser,
  deleteUser,
  updateUserStatus,
  generateReport
};