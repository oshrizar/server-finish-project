const fs = require("fs");
const path = require("path");

const normalizeCard = (card, userId) => {
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
  const imageBufferPromise = funciFunc("cardDefImg.png");
  if (!card.image) {
    card.image = {};
  }
  card.rating = (card.rating &&
    (card.rating.ratingTotalLikes || card.rating.ratingTotalLikes === 0) &&
    (card.rating.ratingTotalUnlikes || card.rating.ratingTotalUnlikes === 0) &&
    card.rating.ratingUsers && { ...card.rating }) || {
    ratingTotalUnlikes: 0,
    ratingTotalLikes: 0,
    ratingUsers: [],
  };
  card.price = card.price || 0;
  card.cart = card.cart || [];
  card.stock = card.stock || 0;
  card.user_id = card.user_id || userId;
  return imageBufferPromise
    .then((imageBuffer) => ({
      ...card,
      image: {
        imageFile: card.image.imageFile || {
          data: `data:image/png;base64,${imageBuffer.toString("base64")}`,
          contentType: "image/png",
        },
        alt: card.image.alt || "Profile picture",
      },
    }))
    .catch((error) => {
      console.error("Error reading the image file:", error);
      throw error; // Propagate the error to the caller
    });
};

module.exports = normalizeCard;
