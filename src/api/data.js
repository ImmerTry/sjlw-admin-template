import axios from '@/libs/api.request'

export const getTableData = ({PageIndex, PageSize}) => {
  return axios.request({
    url: '/news',
    params: {
      "page": PageIndex,
      "size": PageSize
    },
    method: 'get'
  })
};

export const insertTableData = (news) => {
  let newsCreate = new Date();
  let title = news.title;
  let author = news.author;
  let newsStatus = news.newsStatus;
  let newsType = news.newsType;
  const data = {
    title,
    author,
    newsStatus,
    newsType,
    newsCreate
  };
  return axios.request({
    url: '/news',
    method: 'post',
    data
  })
};
export const updateTableData = (news) => {
  let newsModified = new Date();
  let title = news.title;
  let author = news.author;
  let newsStatus = news.newsStatus;
  let newsType = news.newsType;
  let id = news.id;
  const data = {
    id,
    title,
    author,
    newsStatus,
    newsType,
    newsModified
  };
  return axios.request({
    url: '/news',
    method: 'put',
    data
  })
};
export const deleteTableData = (id) => {
  return axios.request({
    url: '/news/' + id,
    method: 'delete',
  })
};

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
};

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
};

export const saveErrorLogger = info => {
  return axios.request({
    url: '/logger',
    data: info,
    method: 'post'
  })
};
