const types = {
    SET_USER_NICKNAME: 'SET_USER_NICKNAME',
    SET_USER_EMAIL: 'SET_USER_EMAIL',
    SET_USER_PROFILE_PICTURE: 'SET_USER_PROFILE_PICTURE',
    SET_USER_FOLLOWING: 'SET_USER_FOLLOWING',
    SET_USER_FOLLOWEDBY: 'SET_USER_FOLLOWEDBY',
    UNSET_USER: 'UNSET_USER',
    SET_SESSION_TOKEN: 'SET_SESSION_TOKEN',
    SET_SESSION_USERID: 'SET_SESSION_USERID',
    SET_SESSION_ACTIVE: 'SET_SESSION_ACTIVE',
    SET_PAGE_DATA: 'SET_PAGE_DATA',
    UPDATE_PAGE_DATA: 'UPDATE_PAGE_DATA'
}

export function setUserEmail(email) {
    return {
        type: types.SET_USER_EMAIL,
        email
    }
}

export function setUserNickname(nickname) {
    return {
        type: types.SET_USER_NICKNAME,
        nickname
    }
}

export function setUserProfilePicture(profilePicture) {
    return {
        type: types.SET_USER_PROFILE_PICTURE,
        profilePicture
    }
}

export function setUserFollowing(following) {
    return {
        type: types.SET_USER_FOLLOWING,
        following
    }
}

export function setUserFollowedBy(followedBy) {
    return {
        type: types.SET_USER_FOLLOWEDBY,
        followedBy
    }
}

export function unsetUser() {
    return {
        type: types.UNSET_USER
    }
}

export function setSessionToken(token) {
    return {
        type: types.SET_SESSION_TOKEN,
        token
    }
}

export function setSessionUserId(userId) {
    return {
        type: types.SET_SESSION_USERID,
        userId
    }
}

export function setSessionActive(active = false) {
    return {
        type: types.SET_SESSION_ACTIVE,
        active
    }
}

export function setPageData(data) {
    return {
        type: types.SET_PAGE_DATA,
        data
    }
}

export function updatePageData(data) {
    return {
        type: types.UPDATE_PAGE_DATA,
        data
    }
}

export default types;