var express = require("express");
var router = express.Router();


const UserService = require("../services/userService");
const userService = new UserService();
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render(
    'login', 
    { errors: [] },
  );
})

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let errors = [];

  if (!email || !password) {
    errors.push("Invalid Email or Password!");
  }

  if (errors.length > 0) {
    return res.render("login", {
      errors: errors,
    });
  }

  try {
    const users = userService.readUsers();

    // Find user by email only
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.render("login", {
        errors: ["Invalid Email or Password!"],
      });
    }

    // Compare plain password from form with hashed password in storage
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.render("login", {
        errors: ["Invalid Email or Password!"],
      });
    }

    return res.redirect("/employees");

  } catch (error) {
    return res.render("login", {
      errors: [error.message],
    });
  }
});

// Create a new user form
router.get("/add", (req, res) => {
  res.render("addUser");
});

// Create a new user submit
router.post("/add", (req, res) => {
  const newUser = req.body;
  const createdUser = userService.createUser(newUser);
  res.redirect("/users/" + createdUser.id);
});

// Read all users
router.get("/", (req, res) => {
  const users = userService.getAllUsers();
  res.render("users", { users: users });
});

// Read a user by ID
router.get("/:id", (req, res) => {
  const user = userService.getUserById(parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.render("user", { user: user });
});

// Update a user by ID form
router.get("/update/:id", (req, res) => {
  const user = userService.getUserById(parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.render("updateUser", { user: user });
});

// Update a user by ID
router.post("/update/:id", (req, res) => {
  const updatedUser = userService.updateUser(parseInt(req.params.id), req.body);
  if (!updatedUser) return res.status(404).send("User not found");
  res.redirect("/users/" + updatedUser.id);
});

// Delete a user by ID form
router.get("/delete/:id", (req, res) => {
  const user = userService.getUserById(parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.render("deleteUser", { user: user });
});

// Delete a user by ID
router.post("/delete/:id", (req, res) => {
  const deletedUser = userService.deleteUser(parseInt(req.params.id));
  if (!deletedUser) return res.status(404).send("User not found");
  res.redirect("/users");
});

module.exports = router;
