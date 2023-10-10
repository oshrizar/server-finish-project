const usersService = require("../model/usersService/usersService");
const cardsService = require("../model/cardsService/cardsService");
const hashService = require("../utils/hash/hashService");
const normalizeUser = require("../model/usersService/helpers/normalizationUserService");
const normalizeCard = require("../model/cardsService/helpers/normalizationCardService");
const chalk = require("chalk");

const usersData = require("./users.json");
const cardsData = require("./cards.json");

const initialData = async () => {
  try {
    let cards = await cardsService.getAllCards();
    if (cards.length) {
      return;
    }
    let users = await usersService.getAllUsers();
    if (users.length) {
      return;
    }
    let user_id = "";
    for (let user of usersData) {
      user.password = await hashService.generateHash(user.password);
      user = await normalizeUser(user);
      user_id = await usersService.registerUser(user);
    }
    user_id = user_id._id + "";
    for (let card of cardsData) {
      card = await normalizeCard(card, user_id);
      await cardsService.createCard(card);
    }
    console.log(chalk.hex("#2eff00")("DATA INITIATED"));
  } catch (err) {
    console.log(chalk.hex("#ff0000")("err from initial"), err);
  }
};

module.exports = initialData;
