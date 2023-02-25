import {formatUnits, BigNumber} from '@leofcoin/utils'

export const networkStats = async () => {
  let accountsHolding = 0
  let accountsHoldingAmount = BigNumber.from(0)
  let topHolders = []
  const balances = Object.entries(await chain.balances)
    .map(([holder, amount]) => {
      amount = BigNumber.from(amount)
      return {holder, amount}
    })
    .sort((a, b) => formatUnits(b.amount.sub(a.amount)))

  for (let {holder, amount} of balances) {
    if (amount.gt(0)) {
      accountsHoldingAmount = accountsHoldingAmount.add(amount)
      accountsHolding += 1
      topHolders.length < 100 && topHolders.push({holder, amount: formatUnits(amount)})
    }
  }
  
  return {
    version: networkVersion,
    peers: peernet.peers,
    accounts: await accountsStore.length(),
    accountsHolding,
    accountsHoldingAmount: formatUnits(accountsHoldingAmount).toString(),
    topHolders
  }
}