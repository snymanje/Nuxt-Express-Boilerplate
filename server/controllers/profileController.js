exports.view = async (req, res) => {
  res.status(200).json({
    status: true,
    message: `I'm a protected route`,
  });
};
