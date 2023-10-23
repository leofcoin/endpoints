import Server from 'socket-request-server';
import { formatUnits } from '@leofcoin/utils';
import shared from './shared.js';
export default (chain, port, networkVersion, remote = false) => {
    return Server({ port, protocol: networkVersion }, {
        network: async ({ send }) => {
            send({ version: networkVersion });
        },
        networkStats: async ({ send }) => {
            send(await shared.networkStats(chain, networkVersion));
        },
        balances: async ({ send }) => send(await chain.balances),
        balanceOf: async ({ address, format = false }, { send }) => {
            const balance = (await chain.balances)[address];
            if (balance)
                send(format ? formatUnits(balance) : balance);
            else
                send(0);
        },
        getNonce: async ({ address }, { send }) => send(await chain.getNonce(address)),
        selectedAccount: ({ send }) => {
            if (remote)
                send(peernet.selectedAccount);
            else
                send(405);
        },
        selectAccount: async ({ address }, { send }) => {
            if (remote)
                try {
                    await walletStore.put('selected-account', address);
                    send(200);
                }
                catch (error) {
                    send(404);
                }
            else
                send(405);
        },
        accounts: async ({ send }) => {
            if (remote)
                send(JSON.parse(new TextDecoder().decode((await walletStore.get('accounts')))));
            else
                send(405);
        },
        hasTransactionToHandle: async ({ send }) => send(await chain.hasTransactionToHandle()),
        getBlock: ({ index }, { send }) => send(chain.blocks[index - 1]),
        blocks: ({ amount }, { send }) => {
            send(chain.blocks.slice(amount));
        },
        sendTransaction: async (transaction, { send }) => {
            try {
                const tx = await chain.sendTransaction(transaction);
                await tx.wait();
                delete tx.wait;
                send(tx);
            }
            catch (error) {
                send(202);
            }
        },
        peerId: ({ send }) => send(peernet.peerId),
        peers: ({ send }) => send(peernet.peers.map(([id, peer]) => id)),
        validators: ({ send }) => send(chain.validators),
        lookup: async ({ name }, { send }) => send(await chain.lookup(name)),
        staticCall: async ({ contract, method, params }, { send }) => send(await chain.staticCall(contract, method, params)),
        nativeBurns: ({ send }) => send(chain.nativeBurns),
        contracts: ({ send }) => send(chain.contracts),
        nativeMints: ({ send }) => send(chain.nativeMints),
        nativeToken: ({ send }) => send(chain.nativeToken),
        nativeTransfers: ({ send }) => send(chain.nativeTransfers),
        totalSize: ({ send }) => send(chain.totalSize),
        totalTransactions: ({ send }) => send(chain.totalTransactions),
        poolTransactions: async ({ send }) => send(await transactionPoolStore.get()),
        transactionsInPool: async ({ send }) => send(await transactionPoolStore.length()),
        transactionPoolSize: async ({ send }) => send(await transactionPoolStore.size()),
        totalBlocks: ({ send }) => send(chain.blocks.length),
        nativeCalls: ({ send }) => send(chain.nativeCalls),
        participating: ({ send }) => send(chain.participating),
        participate: async ({ address }, { send }) => {
            if (remote)
                send(await chain.participate(address));
            else
                send(405);
        },
        deployContract: async ({ transaction, contract }, { send }) => {
            try {
                const tx = await chain.deployContract(contract, transaction);
                await tx.wait();
                delete tx.wait;
                send(tx);
            }
            catch (error) {
                send(error.message);
            }
        },
        createContractAddress: async ({ owner, code, params }, { send }) => {
            try {
                const address = await chain.createContractAddress(owner, code, params);
                send(address);
            }
            catch (error) {
                send(error);
            }
        },
        lastBlock: async (ctx) => ctx.body = chain.lastBlock,
        blockHashMap: async (ctx) => ctx.body = chain.blockHashMap,
        bootstrap: async ({ send }) => {
            send(await shared.bootstrap());
        }
    });
};
