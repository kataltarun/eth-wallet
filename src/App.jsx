import { http, WagmiProvider, createConfig, useConnect, useAccount, useBalance, useDisconnect, useSendTransaction } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet} from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { parseEther } from 'viem'



const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected()
  ],
  transports: {
    [mainnet.id]: http()
  }
})

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}> 
          <WalletOptions/>
          <EthSend/>
          <Account/>
        </QueryClientProvider> 
      </WagmiProvider>
    </>
  )
}

function WalletOptions() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))
}

function EthSend (){

  const { data: hash, sendTransaction } = useSendTransaction()

  async function sendTx() {
      const to = document.getElementById("to").value;
      const value = document.getElementById("value").value;
      sendTransaction({ to, value: parseEther(value) });
  }

  // Todo: use refs here
  return <div>
    <input id="to" placeholder="0xA0Cf…251e" required />
    <input id="value" placeholder="0.05" required />
    <button onClick={sendTx}>Send</button>
    {hash && <div>Transaction Hash: {hash}</div>}
  </div>
}

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const balance = useBalance({
    address
  })

  return (
    <div>
      {address && <div>
        Your address - {address}
        Your balance - {balance.data?.formatted}
      </div>}
      
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}

export default App
