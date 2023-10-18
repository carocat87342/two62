
import EventComment from '@/models/EventComment'
import EventCommentComponent from '@/models/EventCommentComponent'
import { reject } from 'promise-polyfill'
const state = {
  commentComponents: [],
  guestName: null,
  customer: null,
  error: null
}

const getters = {
  getComponentComponents: (state) => {
    return state.commentComponents
  },
}

const mutations = {
  setError(state, message){
    state.error = message;
  },
  setGuestName(state, name){
    state.guestName = name;
  },
  setCustomer(state, customer){
    state.customer = customer;
  },
  setCommentComponents(state, commentComponents) {
    state.commentComponents = commentComponents
  },
  addCommentComponent(state, commentComponent) {
    state.commentComponents.push(commentComponent);
  },
  setCommentsToComponent(state, { commentComponent, comments }) {
    const index = state.commentComponents.findIndex(item => item.id === commentComponent.id);
    state.commentComponents[index].comments = comments;
  },

  removeCommentComponent(state, commentComponent) {
    const index = state.commentComponents.findIndex(item => item.id === commentComponent.id)
    state.commentComponents.splice(index, 1)
  },

  updateCommentComponent(state, commentComponent) {
    const index = state.commentComponents.findIndex(item => item.id === commentComponent.id)
    state.commentComponents.splice(index, 1, commentComponent)
  },

  addChlidComment(state, { commentComponent, comment }) {
    const index = state.commentComponents.findIndex(item => item.id === commentComponent.id);
    state.commentComponents[index].comments = comments;
    state.commentComponent.push(commentComponent);
  },
  setComments(state, { commentComponentId, comments }) {
    const index = state.commentComponents.findIndex(item => item.id == commentComponentId)
    console.log(commentComponentId)
    state.commentComponents[index].comments = comments
  },

  addComment(state, { commentComponentId, comment }) {
    const index = state.commentComponents.findIndex(item => item.id == commentComponentId)
    if (!state.commentComponents[index].comments)
      state.commentComponents[index].comments = []
    state.commentComponents[index].comments.push(comment)
  },
  updateComment(state, comment) {
  },
}

const actions = {
  addCommentComponent({ commit, state }, commentComponent) {
    return new Promise((resolve, reject)=> {
      if (state.guestName) commentComponent = {...commentComponent, name: state.guestName};
      new EventCommentComponent(commentComponent)
        .save()
        .then(res => {
          commit('addCommentComponent', res.data)
          // save customer when user comment as guest
          if(res.customer) commit('setCustomer', res.customer);
          console.log(res)
          resolve(res.data)
        });
    })
  },
  getCommentComponents({ commit, state }, url) {

    return new Promise( async (resolve, reject) => {
      let query = new EventCommentComponent();
      const res = await query.params({url}).get();
      if (res.success) {
          commit('setCommentComponents', res.data)
          // save customer when user comment as guest
          if(res.customer) commit('setCustomer', res.customer);
          resolve(res.data)
      }else {
          commit('setError', res.message);
          resolve([]);
      }
    });
  },

  /****Event comments  */
  getCommentsAction({ commit, state }, commentComponentId) {
    const eventComponent = new EventCommentComponent({ id: commentComponentId })
    return new Promise((resolve, reject) => {
      new EventComment()
        .for(eventComponent)
        .get()
        .then(comments => {
          commit('setComments', { commentComponentId, comments })
          resolve(comments)
        });
    })
  },

  addComment({ commit, state }, comment) {
    const commentComponent = new EventCommentComponent({ id: comment.commentComponent.id })
    if (state.guestName) comment = {...comment, name: state.guestName};
    return new Promise((resolve, reject) => {
      new EventComment(comment)
        .for(commentComponent)
        .save()
        .then(res => {
          if (res.success) {
              // save customer when user comment as guest
              if(res.customer) commit('setCustomer', res.customer);
              resolve(res.data)
          } else {
              commit('setError', res.message);
          }

        })
    })

  },

  deleteCommentComponent({ commit, state }, commentComponent) {
    if (state.guestName) commentComponent = {...commentComponent, name: state.guestName};
    return new Promise((resolve, reject) => {
      new EventCommentComponent(commentComponent)
        .delete()
        .then(res => {
          commit('removeCommentComponent', commentComponent);
          resolve(res)
        })
    })
  },

  updateCommentComponent({ commit, state }, commentComponent) {
    return new Promise((resolve, reject) => {
      if (state.guestName) commentComponent = {...commentComponent, name: state.guestName};
      new EventCommentComponent(commentComponent)
        .save()
        .then(res => {
          if(res.success){
              commit('updateCommentComponent', res.data)
              // save customer when user comment as guest
              if(res.customer) commit('setCustomer', res.customer);
              resolve(res.data)
          } else {
              commit('setError', res.message);
              resolve(null)
          }

        })
    })
  },

  updateCommentAction({commit, state}, comment) {
    return new Promise((resolve, reject) => {
      const commentComponent = new EventCommentComponent({id: comment.eventCommentComponent.id})
      if (state.guestName) comment = {...comment, name: state.guestName};
      new EventComment(comment)
        .for(commentComponent)
        .save()
        .then(res => {
          console.log(res)
          // save customer when user comment as guest
          if(res.customer) commit('setCustomer', res.customer);
          resolve(res)
        })
    })
  },
  deleteCommentAction({commit, state}, comment) {
    return new Promise(async(resolve, reject) => {
      const eventCommentComponent = new EventCommentComponent({id: comment.id})
      if (state.guestName) comment = {...comment, name: state.guestName};
      let query = new EventComment(comment);
      let res = await query.for(eventCommentComponent).delete();
      console.log('deleteCommentAction', res);
        if(res.data.success) {
            // save customer when user comment as guest
            if(res.data.customer) commit('setCustomer', res.data.customer);
            resolve(res.data.data)
        } else {
            commit('setError', res.data.message);
        }
    })
  }

}



export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
