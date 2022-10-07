let users = [];

const addNewUser = (uid, userName) => {
    if (users.filter(user => user.uid === uid).length === 0) {
        users.push({ uid, userName });
        return { uid, userName };
    }
}

const getCurrentUser = (uid) => {
    return users.find(user => user.uid === uid);
}

const removeUser = (uid) => {
    const removedUser = getCurrentUser(uid);
    users = users.filter(user => user.uid !== uid)
    if (removedUser) {
        return removedUser;
    }
}

const getAllUsers = () => {
    return users;
}

module.exports = {
    addNewUser,
    getCurrentUser,
    removeUser,
    getAllUsers
}