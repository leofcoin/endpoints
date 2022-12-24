import Server from 'socket-request-server'
import {formatUnits} from '@leofcoin/utils'

export default (chain, port, protocol) => {
  return Server({ port, protocol }, {
    balances: async ({send}) => 
      send(await chain.balances),
    balanceOf: async ({address, format = false}, {send}) => {
      const balance = (await chain.balances)[address]    
      send(format ? formatUnits(balance) : balance)
    },
    selectedAccount: ({send}) => send(peernet.selectedAccount),
    selectAccount: async ({address}, {send}) => {
      try {
        await walletStore.put('selected-account', address)  
        send(200)
      } catch (error) {
        send(404)
      }    
    },
    accounts: async ({send}) => 
      send(JSON.parse(new TextDecoder().decode((await walletStore.get('accounts'))))),
    hasTransactionToHandle: ({send}) => 
      send(chain.hasTransactionToHandle()),
    getBlock: ({index}, {send}) => 
      send(chain.blocks[index]),
    blocks:({amount}, {send}) => {
      send(chain.blocks.slice(amount))},
    createTransactionFrom: async ({from, to, method, parameters, nonce}, {send}) => {
      try {
        const tx = await chain.createTransactionFrom(from, to, method, parameters, nonce)
        await tx.wait()
        send(tx)
      } catch (error) {
        send(202)
      }
    },  
    peerId: ({send}) =>
      send(peernet.peerId),
    peers: ({send}) =>
      send(node.peers),
    validators: ({send}) => 
      send(chain.validators),
    lookup: async ({name}, {send}) => 
      send(await chain.lookup(name)),
    staticCall: async({contract, method, params}, {send}) => 
      send(await chain.staticCall(contract, method, params)),
    nativeBurns: ({send}) => 
      send(chain.nativeBurns),
    contracts: ({send}) => 
      send(chain.contracts),
    nativeMints: ({send}) => 
      send(chain.nativeMints),
    nativeToken: ({send}) => 
      send(chain.nativeToken),
    nativeTransfers: ({send}) => 
      send(chain.nativeTransfers),
    totalSize: ({send}) => 
      send(chain.totalSize),
    totalTransactions: ({send}) => 
      send(chain.totalTransactions),
    totalBlocks: ({send}) => 
      send(chain.blocks.length),  
    nativeCalls: ({send}) => 
      send(chain.nativeCalls),  
    participating: ({send}) =>
      send(chain.participating),
    participate: async ({address}, {send}) =>
      send(await chain.participate(address)),
    deployContract: async ({code, params}, {send}) => {
      try {
        const tx = await chain.deployContract(code, params)
        await tx.wait()
        delete tx.wait
        send(tx)
      } catch (error) {
        send(error.message)
      }
    },      
    createContractAddress: async ({owner, code, params}, {send}) => {
      try {
        const address = await chain.createContractAddress(owner, code, params)
        send(address)
      } catch (error) {
        send(error)
      }      
    }    
  })  
}

