export default {
  state: {
    userInfo: {},
    userName: '',
    userId: '',
    orgid: '',
    avatorImgPath: '',
    access: '',
    drawState: false,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setOrgid(state, orgid) {
      state.orgid = orgid;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setAccess(state, access) {
      state.access = access;
    },
    setDrawState(state, drawState) {
      state.drawState = Boolean(drawState);
    },
  },
  getters: {},
  actions: {
    // 获取用户相关信息
    // getUserInfo ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     try {
    //       getUserInfo(state.token)
    //         .then(res => {
    //           const data = res.data
    //           commit('setAvator', data.data.avatar)
    //           commit('setUserName', data.data.nickname)
    //           commit('setUserId', data.data.id)
    //           commit('setSdtv', data.data.is_sdtv)
    //           commit('setExchange', data.data.exchange)
    //           // commit('setAccess', data.data.access)
    //           commit('setHasGetInfo', true)
    //           commit(
    //             'setColudServiceName',
    //             data.data.CloudConfig.colud_service_name
    //           )
    //           commit('setOrgid', data.data.orgid)
    //           commit('setUserInfo', data.data)
    //           resolve(data)
    //         })
    //         .catch(err => {
    //           reject(err)
    //         })
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    // }
  },
};
