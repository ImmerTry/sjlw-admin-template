import axios from '@/libs/api.request'

export const login = ({userName, password}) => {
  const data = {
    userName,
    password
  };
  return axios.request({
    url: '/user/login',
    params: {
      userName,
      password
    },
    method: 'post'
  })
};

export const getUserInfo = (token) => {
  const data = {
    token
  };
  return axios.request({
    url: '/user/parseToken',
    params: {
      token
    },
    method: 'post'
  })
};

export const editAvatarUrl = (avatarUrl) => {
  const data = {
    avatarUrl
  };
  return axios.request({
    url: '/user/editAvatarUrl',
    data,
    method: 'post'
  });
};

// export const logout = (token) => {
//   return axios.request({
//     url: '/logout',
//     method: 'post'
//   })
// };
