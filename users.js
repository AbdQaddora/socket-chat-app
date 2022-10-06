let users = [];

const addNewUser = (uid, userName) => {
    users.push({ uid, userName });
    console.log(users);
    return { uid, userName };
}

const getCurrentUser = (uid) => {
    try {
        return users.filter(user => user.uid === uid)[0];
    } catch (error) {
        console.log(error);
    }
    return 'error'
}

const removeUser = (uid) => {
    const user = getCurrentUser(uid);
    users = users.filter(user => user.uid !== uid);
    return user;
}

module.exports = {
    addNewUser,
    getCurrentUser,
    removeUser
}