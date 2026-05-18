var express = require("express");
var router = express.Router();


const fs = require("fs");
const path = require("path");

const UserService = require("../services/userService");
const userService = new UserService();
const bcrypt = require("bcrypt");
const usersFilePath = path.join(__dirname, "../users.json");


router.get("/login", (req, res) => {
  res.render(
    'login', 
    { errors: [], success: req.query.success },
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


  //Create Account
  router.get("/create-account", (req, res) =>{
    res.render(
      'createAccount',
      {errors: [] }
    )
  })

  router.post("/create-account", async (req, res) =>{
    const { name, email, password, passwordCheck } = req.body

    let errors = [];
    let success = [];

    if (!name || name.trim() === "") {
    errors.push("Name is required");
  }

  if (!email || email.trim() === "") {
    errors.push("Email is required");
  }

  if (!password || password.trim() === "") {
    errors.push("Password is required");
  }

  if (!passwordCheck || passwordCheck.trim() === "") {
    errors.push("Please confirm your password");
  }

  if (password !== passwordCheck) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    return res.render("createAccount", {
      errors,
      name,
      email
    });
  }

  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    const users = JSON.parse(data);

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.render("createAccount", {
        errors: ["An account with this email already exists"],
        name,
        email
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "User WILL CHANGE"
    };

    users.push(newUser);

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.redirect("/users/login?success=Account created successfully");

  } catch (error) {
    console.error("Error creating account:", error);

    res.render("createAccount", {
      errors: ["Something went wrong creating your account"],
      name,
      email,
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
