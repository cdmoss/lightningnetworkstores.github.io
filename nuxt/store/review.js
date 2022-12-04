export const state = () => ({
  isPosting: false,
  reviews: []
})

export const actions = {
  postReview(context, { stars, comment, storeID }) {
    const { commit, dispatch } = context
    const body = { storeID, comment, stars }
    commit('setIsPosting', true)
    return this.$axios.post('/api/review', body)
      .then(resp => dispatch('network/showResponse', resp, { root: true }))
      .catch(err => {
        console.error('Error while posting review. err: ', err)
        dispatch('network/showError', err, { root: true})
      })
      .finally(() => commit('setIsPosting', false))
  },
  toggleHelpful({ dispatch }, review) {
    console.log('toggleHelpful.review: ', review)
    const { id, helpful } = review
    return this.$axios.post(`/api/helpful?id=${id}&remove=${helpful}`)
      .then(resp => dispatch('network/showResponse', resp, { root: true }))
      .catch(err => {
        console.error('Error while posting review. err: ', err)
        dispatch('network/showError', err, { root: true})
      })
  }
}

export const mutations = {
  setIsPosting(state, isPosting) {
    state.isPosting = isPosting
  },
  setReviews(state, reviews) {
    state.reviews = reviews
  }
}