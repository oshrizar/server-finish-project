const CustomError = require("../utils/CustomError");
const validateID = require("../validation/idValidationService");

const checkOwnIdIfAdminIsOptionalForUsingSelfID = async (
  idUser,
  idParams,
  res,
  next
) => {
  try {
    await validateID.IDValidation(idParams);
    if (idParams == idUser) {
      next();
    } else {
      res.send("the user is NOT verified for using other id");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

/*
  isAdmin = is admin
  isAdminOptionalForUsingOwnId = indicator of enabling registered user for 
                                 themselves or admin for everyone
*/
const permissionsMiddleware = (
  isAdmin,
  isAdminOptionalForUsingOwnId = false
) => {
  return async (req, res, next) => {
    try {
      if (!req.userData) {
        throw new CustomError("must provide userData");
      }
      if (isAdmin === req.userData.isAdmin && isAdmin === true) {
        return next();
      }
      if (isAdminOptionalForUsingOwnId) {
        return checkOwnIdIfAdminIsOptionalForUsingSelfID(
          req.userData._id,
          req.params.id,
          res,
          next
        );
      }
      res.status(403).json({ msg: "permissions needed" });
    } catch (err) {
      res.status(400).json(err);
    }
  };
};

module.exports = permissionsMiddleware;
