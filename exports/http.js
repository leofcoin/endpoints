import koa from 'koa'
import cors from '@koa/cors'
import Router from '@koa/router'
import {formatUnits} from '@leofcoin/utils'

const api = new koa()
const router = new Router()

export default (chain, port, networkVersion) => {
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

  router.get('/deployContract', async ctx => {
    try {
      const tx = await chain.deployContract(ctx.query.code, ctx.query.params)
      await tx.wait()
      delete tx.wait
      ctx.body = tx
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


