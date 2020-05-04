module.exports.getMain = async (req, res) => {
  const data = {
    message: 'imageSearchApi',
  };
  res.status(200).json(data);
};
