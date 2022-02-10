const WithdrawalState = {
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
    memo: '',
    errorMsg: null
  },
  affiliate: null,
  transfers: []
})

export const actions = {
  getDashboardInfo({ commit }) {
    this.$axios.get('/api/dashboardinfo')
      .then(res => res.data)
      .then(data => data.data)
      .then(({ balance, transfers, profile, affiliate }) => {
        commit('setBalance', balance)
        commit('setTransfers', transfers)
        commit('setProfile', profile)
        commit('setAffiliate', affiliate)
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
  sendPayment({ commit }, invoice) {
    commit('setWithdrawalState', WithdrawalState.PROCESSING)
    const body = { fee: 10, payment_request: invoice }
    this.$axios.post('/api/withdraw', body)
      .then(res => res.data)
      .then(data => data.status === 'success')
      .then(success => {
        if (success) {
          commit('setWithdrawalState', WithdrawalState.SUCCESS)
          return WithdrawalState.SUCCESS
        } else {
          commit('setWithdrawalState', WithdrawalState.FAILED)
          return WithdrawalState.FAILED
        }
      })
      .catch(err => {
        console.error('Withdrawal error: ', err)
        commit('setWithdrawalState', WithdrawalState.FAILED)
        commit('setErrorMessage', err.response.data.message)
        return WithdrawalState.FAILED
      })
  },
  resetWithdrawalState({ commit }) {
    commit('setWithdrawalState', WithdrawalState.INITIAL)
    commit('setErrorMessage', null)
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
  setInvoice(state, invoice) {
    state.deposit.invoice = invoice
  },
  setPaymentId(state, id) {
    state.deposit.id = id
  },
  setWithdrawalState(state, withdrawalState) {
    state.withdrawal.state = withdrawalState
  },
  setErrorMessage(state, errorMsg) {
    state.withdrawal.errorMsg = errorMsg
  }
}