async function userAccount(req, res) {
    const user = req.user;
    res.json({ user });
}

export default { userAccount };
