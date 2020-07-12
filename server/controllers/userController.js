exports.getCurrentUser = async(req, res, next) => {
    const user = req.user;
    res.status(200).json({
        status: true,
        user
    });
}