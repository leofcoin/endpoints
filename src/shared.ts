import { formatUnits } from '@leofcoin/utils'
export const networkStats = async (chain, networkVersion) => {
  let accountsHolding = 0
  let accountsHoldingAmount = BigInt(0)
  let topHolders = []
  const balances = Object.entries(await chain.balances)
    .map(([holder, amount]) => {
      // amount = BigNumber.from(amount)
      return { holder, amount }
    })
    // @ts-ignore
    .sort((a, b) => formatUnits(b.amount.sub(a.amount)))

  for (let { holder, amount } of balances) {
    // @ts-ignore
    if (amount > 0) {
      // @ts-ignore
      accountsHoldingAmount += amount
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
