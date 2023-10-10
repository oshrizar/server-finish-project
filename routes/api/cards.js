const express = require("express");
const router = express.Router();
const cardsServiceModel = require("../../model/cardsService/cardsService");
const cardsValidationService = require("../../validation/cardsValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");
const { IDValidation } = require("../../validation/idValidationService");
const normalizeCardService = require("../../model/cardsService/helpers/normalizationCardService");
const CustomError = require("../../utils/CustomError");
const handleImageToData = require("../../utils/handleImageToData");
//http://localhost:8181/api/cards/allCards
// all
//get all cards
router.get("/allCards", async (req, res) => {
  try {
    const allCards = await cardsServiceModel.getAllCards();
    if (!allCards) {
      return res.json({ msg: "no cards at the data base" });
    }
    let newCardsArr = JSON.parse(JSON.stringify(allCards));
    for (let i = 0; i < newCardsArr.length; i++) {
      newCardsArr[i] = handleImageToData(newCardsArr[i]);
    }
    res.json(newCardsArr);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/card/:id
// all
//get specific card
router.get("/card/:id", async (req, res) => {
  try {
    await IDValidation(req.params.id);
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    if (!cardFromDB) {
      return res.status(400).json({ msg: "no card found" });
    }
    res.json(handleImageToData(cardFromDB));
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/getCart
//authed
//get all cards from cart of user
router.get("/getCart", authmw, async (req, res) => {
  try {
    let userCardsArr = [];
    let {
      userData: { _id },
    } = req;
    let cardsArr = await cardsServiceModel.getAllCards();
    if (cardsArr.length === 0) {
      res.status(204).json([]);
      return;
    }
    let newCardsArr = JSON.parse(JSON.stringify(cardsArr));
    for (let i = 0; i < newCardsArr.length; i++) {
      newCardsArr[i] = handleImageToData(newCardsArr[i]);
    }
    for (const card of newCardsArr) {
      let { cart } = card;
      for (const user of cart) {
        if (user == _id) {
          userCardsArr.push(card);
          break;
        }
      }
    }
    res.status(200).json(userCardsArr);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/create
//admin only
//create a new card
router.post(
  "/create",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      await cardsValidationService.cardValidation(req.body);
      let normalCard = await normalizeCardService(req.body, req.userData._id);
      const dataFromMongoose = await cardsServiceModel.createCard(normalCard);
      res.json(dataFromMongoose);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/cards/edit/:id
//admin only
//edit a card
router.put(
  "/edit/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      await IDValidation(req.params.id);
      let data = await cardsServiceModel.getCardById(req.params.id);
      await cardsValidationService.cardValidation(req.body);
      req.body.cart = data.cart;
      const cardFromDB = await cardsServiceModel.updateCard(
        req.params.id,
        req.body
      );
      res.json(cardFromDB);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/cards/rate/:id
//authed
//rate a card
router.patch("/rate/:id", authmw, async (req, res) => {
  try {
    await IDValidation(req.params.id);
    let card = await cardsServiceModel.getCardById(req.params.id);
    if (!card) {
      throw new CustomError("no card found using this id");
    }
    let { rating } = card;
    for (const userIdInArrayOfCard of rating.ratingUsers) {
      if (req.userData && req.userData._id == userIdInArrayOfCard) {
        throw new CustomError(
          "user already rated this, able to rate only once!"
        );
      }
    }
    let { liked } = req.body;
    if (typeof liked == "boolean" && (liked === false || liked === true)) {
      liked
        ? rating.ratingTotalLikes
          ? (rating.ratingTotalLikes += 1)
          : (rating.ratingTotalLikes = 1)
        : rating.ratingTotalUnlikes
        ? (rating.ratingTotalUnlikes += 1)
        : (rating.ratingTotalUnlikes = 1);
      rating.ratingUsers = [...rating.ratingUsers, req.userData._id];
      card.rating = { ...rating };
      res.status(200).json(await cardsServiceModel.updateCard(card._id, card));
    } else {
      throw new CustomError(
        "invalid rating, please send an object {liked:<Boolean (true OR false)>}"
      );
    }
  } catch (err) {
    res.status(400).json(err);
  }
});
// router.patch("/rate/:id", authmw, async (req, res) => {
//   try {
//     await IDValidation(req.params.id);
//     let card = await cardsServiceModel.getCardById(req.params.id);
//     if (!card) {
//       throw new CustomError("no card found using this id");
//     }
//     let { rating } = card;
//     for (const userIdInArrayOfCard of rating.ratingUsers) {
//       if (req.userData && req.userData._id == userIdInArrayOfCard) {
//         throw new CustomError(
//           "user already rated this, able to rate only once!"
//         );
//       }
//     }
//     let { score } = req.body;
//     if (
//       typeof score == "number" &&
//       score % 1 == 0 &&
//       1 <= score &&
//       score <= 5
//     ) {
//       rating.ratingTotalScore += score;
//       rating.ratingUsers = [...rating.ratingUsers, req.userData._id];
//       card.rating = { ...rating };
//       res.status(200).json(await cardsServiceModel.updateCard(card._id, card));
//     } else {
//       throw new CustomError(
//         "invalid rating, please send an object {score:<Number (score between 1 to 5)>}"
//       );
//     }
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

//http://localhost:8181/api/cards/cart/:id
//authed
//add/remove card to/from cart
router.patch("/cart/:id", authmw, async (req, res) => {
  try {
    let addedToCart = false;
    let cardId = req.params.id;
    await IDValidation(cardId);

    let currCard = await cardsServiceModel.getCardById(cardId);
    if (!currCard) {
      throw new CustomError("no card found to add");
    }
    let newCurrCard = JSON.parse(JSON.stringify(currCard));
    if (newCurrCard.cart.find((userId) => userId == req.userData._id)) {
      newCurrCard.cart = newCurrCard.cart.filter(
        (userId) => userId != req.userData._id
      );
      newCurrCard.stock++;
    } else {
      addedToCart = true;
      newCurrCard.cart = [...newCurrCard.cart, req.userData._id];
      newCurrCard.stock--;
    }
    currCard = { ...newCurrCard };

    let updatedCartCard = await cardsServiceModel.updateCard(cardId, currCard);
    let newUpdatedCartCard = JSON.parse(JSON.stringify(updatedCartCard));
    if (
      newUpdatedCartCard.image &&
      newUpdatedCartCard.image.imageFile &&
      newUpdatedCartCard.image.imageFile.data
    ) {
      let tempImage = JSON.parse(
        JSON.stringify(newUpdatedCartCard.image.imageFile.data)
      );
      const bufferData = Buffer.from(tempImage.data);
      // Convert the Buffer object to a Base64-encoded string
      const base64Data = bufferData.toString("base64");

      newUpdatedCartCard.image.dataStr = base64Data + "";
    }
    res.status(200).json({
      data: newUpdatedCartCard,
      addedToCart,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/delete/:id
//admin only
//delete card from DB
router.delete(
  "/delete/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      let card = await cardsServiceModel.deleteCard(req.params.id);
      if (!card) {
        return res.json({ msg: "card not found" });
      }
      res.status(200).json(card);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

module.exports = router;
