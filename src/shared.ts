import { formatUnits, BigNumber } from '@leofcoin/utils'
export const networkStats = async (chain, networkVersion) => {
  let accountsHolding = 0
  let accountsHoldingAmount = BigNumber.from(0)
  let topHolders = []
  const balances = Object.entries(await chain.balances)
    .map(([holder, amount]) => {
      amount = BigNumber.from(amount)
      return { holder, amount }
    })
    // @ts-ignore
    .sort((a, b) => formatUnits(b.amount.sub(a.amount)))

  for (let { holder, amount } of balances) {
    // @ts-ignore
    if (amount.gt(0)) {
      // @ts-ignore
      accountsHoldingAmount = accountsHoldingAmount.add(amount)
      accountsHolding += 1
      // @ts-ignore
      topHolders.length < 100 && topHolders.push({ holder, amount: formatUnits(amount) })
    }
  }

  return {
    version: networkVersion,
    peers: globalThis.peernet.peers.map(([id, peer]) => id),
    accounts: await globalThis.accountsStore.length(),
    accountsHolding,
    accountsHoldingAmount: formatUnits(accountsHoldingAmount).toString(),
    topHolders
  }
}

const bootstrap = async () => {
  return globalThis.blockStore.values()
}

export default {
  networkStats,
  bootstrap
}
