const fs = require("fs");
const path = require("path");

const funciFunc = (nameOfImage) => {
  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "assets",
    "imgs",
    nameOfImage
  );

  return new Promise((resolve, reject) => {
    fs.readFile(imagePath, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      const imageBuffer = Buffer.from(data);
      resolve(imageBuffer);
    });
  });
};

const normalizeUser = (userData) => {
  if (!userData.image) {
    userData.image = {};
  }
  const imageBufferPromise = userData
    ? userData.gender == "male"
      ? funciFunc("maleAvatar.jpg")
      : userData.gender == "female"
      ? funciFunc("femaleAvatar.jpg")
      : userData.gender == "other"
      ? funciFunc("otherAvatar.jpg")
      : funciFunc("errorImg.png")
    : funciFunc("errorImg.png");
  return imageBufferPromise
    .then((imageBuffer) => ({
      ...userData,
      image: {
        imageFile: userData.image.imageFile || {
          data: `data:image/png;base64,${imageBuffer.toString("base64")}`,
          contentType: "image/png",
        },
        alt: userData.image.alt || "Profile picture",
      },
    }))
    .catch((error) => {
      console.error("Error reading the image file:", error);
      throw error; // Propagate the error to the caller
    });
};

module.exports = normalizeUser;
