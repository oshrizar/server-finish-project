const Card = require("./Card");
const normalizeCardService = require("../../cardsService/helpers/normalizationCardService");

const createCard = (cardToSave) => {
  let card = new Card(cardToSave);
  return card.save();
};

const getAllCards = () => {
  return Card.find();
};

const getCardById = (id) => {
  return Card.findById(id);
};

const updateCard = async (id, cardToUpdate) => {
  return Card.findByIdAndUpdate(
    id,
    await normalizeCardService(cardToUpdate, cardToUpdate.user_id + ""),
    {
      new: true,
    }
  );
};

const getCardsByUserId = (userId) => {
  return Card.find({ user_id: userId });
};

const deleteCard = (id) => {
  return Card.findByIdAndDelete(id);
};

module.exports = {
  createCard,
  getAllCards,
  getCardById,
  getCardsByUserId,
  updateCard,
  deleteCard,
};
