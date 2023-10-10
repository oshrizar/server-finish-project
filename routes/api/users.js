const express = require("express");
const router = express.Router();
const hashService = require("../../utils/hash/hashService");
const authValidationService = require("../../validation/authValidationService");
const normalizeUser = require("../../model/usersService/helpers/normalizationUserService");
const usersServiceModel = require("../../model/usersService/usersService");
const { generateToken } = require("../../utils/token/tokenService");
const CustomError = require("../../utils/CustomError");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");
const failedLoginStoreService = require("../../model/mongodb/failedLoginStore/FailedLoginStoreService");
const failedLoginHelper = require("../../model/failedLoginStoreService/helpers/failedLoginStoreNormalizations");
const handleEmailExistsErrorFromMongoose = require("../../utils/emailExists");
const handleImageToData = require("../../utils/handleImageToData");
//http://localhost:8181/api/users/users
//admin only
//get an array of all users
router.get(
  "/users",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      const usersArr = await usersServiceModel.getAllUsers();
      res.status(200).json(usersArr);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);
//http://localhost:8181/api/users/user/:id
//admin for any user
//get information about the user
router.get(
  "/user/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      let user = await usersServiceModel.getUserById(req.params.id);
      if (!user) {
        return res.json({ msg: "user not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);
//http://localhost:8181/api/users/userInfo
//token for themselves
//get information about the user using the token
router.get("/userInfo", authmw, async (req, res) => {
  try {
    if (!req.userData) {
      throw new CustomError("something went wrong, try again later");
    }
    let userFromDB = await usersServiceModel.getUserById(req.userData._id);
    if (!userFromDB) {
      throw new CustomError("something went wrong, try again later");
    }
    res.status(200).json(handleImageToData(userFromDB));
  } catch (err) {
    res.status(400).json(err);
  }
});
//http://localhost:8181/api/users/register
//all
//register
router.post("/register", async (req, res) => {
  try {
    await authValidationService.registerUserValidation(req.body);
    req.body.password = await hashService.generateHash(req.body.password);
    req.body = await normalizeUser(req.body);
    let user = await usersServiceModel.registerUser(req.body);
    if (!user.password) {
      throw new CustomError("something went wrong, check the database");
    }
    let newUser = JSON.parse(JSON.stringify(user));
    delete newUser.password;
    res.json(newUser);
  } catch (err) {
    res.status(400).json(handleEmailExistsErrorFromMongoose(err));
  }
});
//http://localhost:8181/api/users/login
//all
//login
router.post("/login", async (req, res) => {
  try {
    await authValidationService.loginUserValidation(req.body);
    let { email } = req.body;
    const userData = await usersServiceModel.getUserByEmail(email);
    if (!userData) throw new CustomError("invalid email and/or password");
    let blockedUser = await failedLoginStoreService.getBlockedUserByEmail(
      email
    );
    if (blockedUser) {
      await failedLoginHelper.handleBlockTime(blockedUser);
    }
    const isPasswordMatch = await hashService.cmpHash(
      req.body.password,
      userData.password
    );
    if (!isPasswordMatch) {
      let attempts = blockedUser ? blockedUser.attempts : 0;
      let normalizedLoginFailure =
        failedLoginHelper.normalizeLoginFailure(email);
      !blockedUser &&
        (await failedLoginStoreService.addNewUserToStore(
          normalizedLoginFailure
        ));
      attempts++;
      await failedLoginStoreService.incrementAttemptsOfUser(email);
      if (attempts == 3) {
        throw new CustomError(
          "Too many failed login attempts. Account blocked."
        );
      }
      throw new CustomError("Invalid email or password");
    }
    await failedLoginStoreService.removeBlockedUserFromStore(email);
    const token = await generateToken({
      _id: userData._id,
      isAdmin: userData.isAdmin,
    });
    res.json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
});
//http://localhost:8181/api/users/edit/:id
//token for themselves only
//edit user
router.put(
  "/edit/:id",
  authmw,
  permissionsMiddleware(false, true),
  async (req, res) => {
    try {
      let { id } = req.params;
      let newData = req.body;
      await authValidationService.editUserValidation(newData);
      if (newData && !newData.gender) {
        const userFullDataFromDB = await usersServiceModel.getUserById(id);
        newData.gender = userFullDataFromDB.gender;
      }
      let newUpdatedUser = await usersServiceModel.updateUserById(id, newData);
      res.status(200).json(newUpdatedUser);
    } catch (err) {
      res.status(400).json(handleEmailExistsErrorFromMongoose(err));
    }
  }
);
//http://localhost:8181/api/users/user/:id
//token
//invert isAdmin value (true/false)
router.patch(
  "/user/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      let user = await usersServiceModel.changeAdminStatusOfUser(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);
//http://localhost:8181/api/users/delete/:id
//token for themselves or admin for all users
router.delete(
  "/delete/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      let user = await usersServiceModel.deleteOneUser(req.params.id);
      if (!user) {
        res.status(204).json({ msg: "no user found by the id that was given" });
        return;
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);
router.delete("/deleteSelf", authmw, async (req, res) => {
  try {
    if (req.userData) {
      res
        .status(200)
        .json(await usersServiceModel.deleteOneUser(req.userData._id));
    } else {
      throw new CustomError("something went wrong, try again later");
    }
  } catch (err) {
    res.status(400).json(err);
  }
});
module.exports = router;
