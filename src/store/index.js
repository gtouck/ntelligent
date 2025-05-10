import { createStore, createLogger } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
  state() {
    return {
      language: 'zh-cn',
      userInfo: {
        //   id: 1,
        //   username: 'user',
        //   company_id: 1,
        //   is_admin: false,
        //   is_system_admin: false,
        //   disabled: false,
        //   token:
        //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MTcyMzYwMzMwNH0.oz-jrNX3qc1Shsn7KTKSDoX3cBCCSQVSXzxr6h3tZPk',
      },
      companyInfo: {
        // contact_person: 'John Doe',
        // name: 'Company A',
        // created_at: '2024-08-27T11:16:59',
        // contact_phone: '12345678',
        // contact_email: 'test@163.com',
        // id: 1,
      },
      selectShip: '',
      shipArr: [],
    };
  },
  mutations: {
    setLanguage(state, data) {
      state.language = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setCompany(state, data) {
      state.companyInfo = data;
    },
    setShipArr(state, data) {
      state.shipArr = data;
    },
    setSelectShip(state, data) {
      state.selectShip = data;
    },
  },
  getters: {
    getNaviUserInfo: state => {
      return state.naviUserInfo;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({ storage: window.sessionStorage }), createLogger()],
});
export default store;
