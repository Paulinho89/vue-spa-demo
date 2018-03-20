/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

// import Vue from 'vue';
import types from '../types';
import Axios from '@/services/axios';

export default {
  [types.CHECK](state) {
    state.authenticated = !!localStorage.getItem('id_token');
    if (state.authenticated) {
      Axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('id_token')}`;
    }
  },

  [types.LOGIN](state, token) {
    state.authenticated = true;
    localStorage.setItem('id_token', token);
    Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  [types.LOGOUT](state) {
    state.authenticated = false;
    localStorage.removeItem('id_token');
    Axios.defaults.headers.common.Authorization = '';
  },
};
