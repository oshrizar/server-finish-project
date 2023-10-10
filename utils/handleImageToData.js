module.exports = (itemFromDB) => {
  let newItemFromDB = JSON.parse(JSON.stringify(itemFromDB));
  if (
    newItemFromDB.image &&
    newItemFromDB.image.imageFile &&
    newItemFromDB.image.imageFile.data
  ) {
    let tempImage = JSON.parse(
      JSON.stringify(newItemFromDB.image.imageFile.data)
    );
    const bufferData = Buffer.from(tempImage.data);
    // Convert the Buffer object to a Base64-encoded string
    const base64Data = bufferData.toString("base64");

    newItemFromDB.image.dataStr = base64Data + "";
  }
  return newItemFromDB;
};
