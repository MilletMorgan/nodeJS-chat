import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user: null
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        }
    },
    actions: {
        async logUser({ commit }, { email, password }) {
            const { data: user } = await axios.post('/api/login', { email, password });

            commit('setUser', { email: user.email, name: user.name, id: user.id });
        },

        async retrieveUser({ commit }) {
            const { data: user } = await axios.get('/api/login');

            commit('setUser', { email: user.email, name: user.name, id: user.id });
        },
    },
});
