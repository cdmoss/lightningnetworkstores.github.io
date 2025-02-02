export const WithdrawalState = {
  INITIAL: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  FAILED: 3
}

export const state = () => ({
  deposit: {
    id: null,
    invoice: null
  },
  profile: null,
  balance: null,
  withdrawal: {
    state: WithdrawalState.INITIAL,
    memo: ''
  },
  affiliate: null,
  contributorProgram: null,
  transfers: []
})

export const actions = {
  getDashboardInfo({ commit, state }) {
    this.$axios.get('/api/dashboardinfo')
      .then(res => res.data)
      .then(data => data.data)
      .then(({ balance, transfers, profile, affiliate, contributor_program }) => {
        commit('setBalance', balance)
        commit('setTransfers', transfers)
        commit('setProfile', profile)
        commit('setAffiliate', affiliate)
        commit('setContributorProgram', contributor_program)
      })
      .then(() => this.$axios.get('/api/logstatus'))
      .then(res => res.data.data.user)
      .then(user => {
        const twitterID = user.id
        const updatedProfile = Object.assign({}, state.profile)
        updatedProfile.twitterID = twitterID
        commit('setProfile', updatedProfile)
      })
  },
  async getInvoice({ commit }, value) {
    const body = { amount: value }
    try {
      const resp = await this.$axios.post('/api/deposit', body)
      const { payment_request, id } = resp.data.data
      commit('setInvoice', payment_request)
      commit('setPaymentId', id)
      commit('updatePendingBalance', value)
      return payment_request
    } catch (err) {
      console.error('Error while trying to fetch invoice. err: ', err)
    }
  },
  cancelInvoice({ commit }) {
    commit('setInvoice', null)
    commit('setPaymentId', null)
  },
  async sendPayment({ commit, dispatch }, { invoice, address, amount, comment = '', feeAmount }) {
    commit('setWithdrawalState', WithdrawalState.PROCESSING)
    let url = '/api/withdraw'
    let body = { fee: feeAmount, payment_request: invoice }
    if (address && amount) {
      url = '/api/lnurlwithdraw'
      body = { fee: feeAmount, address, amount, comment }
    }
    try {
      const resp = await this.$axios.post(url, body)
      if (resp.data.status === 'success') {
        commit('setWithdrawalState', WithdrawalState.SUCCESS)
        return {
          state: WithdrawalState.PROCESSING,
          withdrawalID: resp.data.data.withdrawalID
        }
      } else {
        commit('setWithdrawalState', WithdrawalState.FAILED)
        return { state: WithdrawalState.FAILED, message: err.response.data.message }
      }
    } catch (err) {
      console.error('Withdrawal error: ', err)
      commit('setWithdrawalState', WithdrawalState.FAILED)
      dispatch('network/showError', err, { root: true})
      return { state: WithdrawalState.FAILED, message: err.response.data.message }
    }
  },
  resetWithdrawalState({ commit }) {
    commit('setWithdrawalState', WithdrawalState.INITIAL)
  },
  async checkDeposit({ commit, state }) {
    try {
      const { id } = state.deposit
      const resp = await this.$axios.get(`/api2/check_payment?id=${id}`)
      const isPaid = resp.data.data.paid
      if (isPaid) {
        commit('setInvoice', null)
      }
      return isPaid
    } catch (err) {
      console.error('Error while polling for deposit state. err: ', err)
    }
  },
  async transfer(context, payload) {
    try {
      const res = await this.$axios.post('/api/transfer', payload)
      return res.data.status === 'success'
    } catch (err) {
      console.error('Error while performing internal transfer. Err: ', err)
    }
    return false
  },
  async checkWithdrawal(context, withdrawalID) {
    try {
      console.log('checking withdrawal with id: ', withdrawalID)
      const res = await this.$axios.get(`/api/check_withdrawal?id=${withdrawalID}`)
      const { data } = res
      return data && data.data && data.data.paid
    } catch (err) {
      console.error('Error trying to check on withdrawal. err: ', err)
    }
  }
}

export const mutations = {
  updatePendingBalance(state, pending) {
    state.balance.pending_deposits = +pending
  },
  setBalance(state, balance) {
    state.balance = balance
  },
  setTransfers(state, transfers) {
    state.transfers = transfers
  },
  setProfile(state, profile) {
    state.profile = profile
  },
  setAffiliate(state, affiliate) {
    state.affiliate = affiliate
  },
  setContributorProgram(state, contributorProgram) {
    state.contributorProgram = contributorProgram
  },
  setInvoice(state, invoice) {
    state.deposit.invoice = invoice
  },
  setPaymentId(state, id) {
    state.deposit.id = id
  },
  setWithdrawalState(state, withdrawalState) {
    state.withdrawal.state = withdrawalState
  }
}