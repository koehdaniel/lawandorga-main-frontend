import { CollabText } from "@/types/collab";
import { CollabState, RootState } from "@/types/state";
import { ActionContext } from "vuex";
import axios from "../api";

const state: CollabState = {
  null: null,
};

const getters = {};

const actions = {
  createTextVersion: (
    _: ActionContext<CollabState, RootState>,
    data: CollabText,
  ) => {
    return new Promise<void>((resolve, reject) => {
      axios
        .post(`collab/text_documents/${data.document}/versions/`, data)
        .then(() => resolve())
        .catch((error) => reject(error.response.data));
    });
  },
};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
