import axios from 'axios'
export default {
  async nuxtServerInit ({ dispatch, commit }, { req, res }) {
    if (req.cookies && req.cookies.token) {
      // 存储token
      commit('SET_USER', req.cookies.token)
    }
    // 初始化组件内的数据
    await dispatch('ADMIN_INFO')
  },

  async ARTICLE_DETAIL ({ commit, state, getters }, id) {
    const { data } = await axios.get(`${getters.baseURL}/article?id=${id}`)
    commit('ARTICLE_DETAIL', data)
  },

  async LIST_PAGE ({ commit, state, getters }, params) {
    let { typeName = '', category = '', page = 1 } = params
    // category可能有中文，所以编码
    category = encodeURI(category)
    switch (typeName) {
      case 'archives':
        const archiveData = await axios.get(`${getters.baseURL}/archive?date=${category}&limit=15&page=${page}`)
        commit('LIST_PAGE', {
          data: archiveData,
          category: decodeURI(category),
          page
        })
        break
      case 'tags':
        const tagData = await axios.get(`${getters.baseURL}/tag?tag=${category}&limit=15&page=${page}`)
        commit('LIST_PAGE', {
          data: tagData,
          category: decodeURI(category),
          page
        })
        break
      case 'search':
        /* 对于搜索来说，category相当于关键字 */
        const searchData = await axios.get(`${getters.baseURL}/search?q=${category}&limit=15&page=${page}`)
        commit('LIST_PAGE', {
          data: searchData,
          category: decodeURI(category),
          page
        })
        break
      default:
        // 首页数据
        const postData = await axios.get(`${getters.baseURL}/posts?limit=15&page=${page}`)
        commit('LIST_PAGE', {
          data: postData,
          category: decodeURI(category),
          page
        })
        break
    }
  },

  async TAGS ({ commit, state, getters }) {
    const { data } = await axios.get(`${getters.baseURL}/tags`)
    commit('TAGS', data)
  },

  async ARCHIVES ({ commit, state, getters }) {
    const { data } = await axios.get(`${getters.baseURL}/archives`)
    commit('ARCHIVES', data)
  },

  async ADMIN_INFO ({ commit, state, getters }) {
    const { data } = await axios.get(`${getters.baseURL}/administrator`)
    commit('ADMIN_INFO', data)
  },

  /* 需要进行验证才能操作的请求 */
  async LIST_BY_ALL ({ commit, state, getters }, page) {
    const { data } = await axios.get(`${getters.baseURL}/articles?limit=15&page=${page}`, {
      headers: {
        token: state.token
      }
    })
    commit('LIST_BY_ALL', data)
  },

  async DEL_ARTICLE ({ commit, state, getters }, id) {
    const { data } = await axios.delete(`${getters.baseURL}/article?id=${id}`, {
      headers: {
        token: state.token
      }
    })
    commit('STATUS', data)
  },

  async SET_AVATAR ({ commit, state, getters }, image) {
    const { data } = await axios.post(`${getters.baseURL}/avatar`, image, {
      headers: {
        'Content-Type': 'multipart/form-data',
        token: state.token
      }
    })
    commit('STATUS', data)
  },

  /* 需要提交数据的请求 */
  async PUBLISH_ARTICLE ({ commit, state, getters }, content) {
    const { data } = await axios.post('/v1/article', content, {
      headers: {
        token: state.token
      }
    })
    commit('STATUS', data)
  },

  async UPDATE_PASSWORD ({ commit, state, getters }, password) {
    const { data } = await axios.put('/v1/password', password, {
      headers: {
        token: state.token
      }
    })
    commit('STATUS', data)
  },

  async ADMIN ({ commit, state, getters }, info) {
    const { data } = await axios.put('/v1/administrator', info, {
      headers: {
        token: state.token
      }
    })
    commit('STATUS', data)
  },

  async LOGIN ({ commit }, userInfo) {
    // 登陆成功后,会得到token
    const { data } = await axios.post('/v1/login', userInfo)
    commit('STATUS', data)
  },

  async LOGOUT ({ commit }) {
    const { data } = await axios.post('/v1/logout')
    commit('STATUS', data)
  }
}
