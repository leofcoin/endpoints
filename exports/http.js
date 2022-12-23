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

  // todo finish ...
  api.use(cors)
  api.use(router)
  api.listen(port)
}


