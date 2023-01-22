import koa from 'koa'
import cors from '@koa/cors'
import Router from '@koa/router'
import {formatUnits} from '@leofcoin/utils'
import {readFile} from 'fs/promises'
import Showdown from 'showdown'

const api = new koa()
const router = new Router()

const converter = new Showdown.Converter()
const apiFile = await readFile('./api.md')

export default (chain, port, networkVersion) => {
  // api routes
  router.get('/', ctx => {
    ctx.body = converter.makeHtml(apiFile.toString())
  })

  router.get('/network', ctx => {
    ctx.body = networkVersion
  })

  router.get('/balances', async ctx => {
    ctx.body = await chain.balances
  })

  router.get('balanceOf', async ctx => {
    const balance = (await chain.balances)[ctx.query.address]    
      ctx.body = format ? formatUnits(balance) : balance
  })
  
  router.get('/selectedAccount', ctx => ctx.body = peernet.selectedAccount)

  router.get('/selectAccount', async ctx => {
    try {
      await walletStore.put('selected-account', address)  
    } catch (error) {
    }
    return
  })

  router.get('/accounts', async ctx => {
    ctx.body = JSON.parse(new TextDecoder().decode((await walletStore.get('accounts'))))
  })

  router.get('/hasTransactionToHandle', async ctx => {
    ctx.body = await chain.hasTransactionToHandle()
  })
  router.get('/getBlock', ctx => ctx.body = chain.blocks[ctx.query.index])

  router.get('/blocks', ctx => {
    ctx.body = chain.blocks.slice(ctx.query.amount)
  })

  router.get('/createTransactionFrom', async ctx => {
    try {
      const tx = await chain.createTransactionFrom(ctx.query.from, ctx.query.to, ctx.query.method, ctx.query.parameters, ctx.query.nonce)
      await tx.wait()
      send(tx)
    } catch (error) {
      send(202)
    }
  })

  router.get('/peerId', ctx => 
    ctx.body = peernet.peerId
  )

  router.get('/validators', ctx => 
    ctx.body = chain.validators
  )

  router.get('/lookup', ctx => 
    ctx.body = chain.lookup(ctx.query.name)
  )
  
  router.get('/staticCall', async ctx => 
    ctx.body = await chain.staticCall(ctx.query.contract, ctx.query.method, ctx.query.params)
  )
  
  router.get('/nativeBurns', ctx => 
    ctx.body = chain.nativeBurns
  )

  router.get('/contracts', ctx => 
    ctx.body = chain.contracts
  )
  
  router.get('/nativeMints', ctx => 
    ctx.body = chain.nativeMints
  )

  router.get('/nativeToken', ctx => 
    ctx.body = chain.nativeToken
  )

  router.get('/nativeTransfers', ctx =>
    ctx.body = chain.nativeTransfers
  )

  router.get('/totalSize', ctx => 
    ctx.body = chain.totalSize
  )
    
  router.get('/totalTransactions', ctx => 
    ctx.body = chain.totalTransactions
  )

  router.get('/totalBlocks', ctx => 
    ctx.body = chain.blocks.length
  )  
    
  router.get('/nativeCalls', ctx => 
    ctx.body = chain.nativeCalls
  )
  
  router.get('/participating', ctx =>
    ctx.body = chain.participating
  )

  router.get('participate', async ctx =>
    ctx.body = await chain.participate(ctx.query.address)
  )

  router.get('/deployContract', async ctx => {
    try {
      const tx = await chain.deployContract(ctx.query.code, ctx.query.params)
      await tx.wait()
      delete tx.wait
      ctx.body = JSON.stringify(tx)
    } catch (error) {
      
    }
  })
  
  router.get('/createContractAddress', async ctx => {
    try {
      const address = await chain.createContractAddress(ctx.query.owner, ctx.query.code, ctx.query.params)
      ctx.body = address
    } catch (error) {
      
    }
  })

  // todo finish ...
  api.use(cors('*'))
  api.use(router.routes())
  api.listen(port)
}


