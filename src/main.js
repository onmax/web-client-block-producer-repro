import * as Nimiq from '@nimiq/core/web'

await Nimiq.default()

const config = new Nimiq.ClientConfiguration()
config.logLevel('debug')

const client = await Nimiq.Client.create(config.build())
window.client = client

client.addConsensusChangedListener((state) => {
  console.log(`Consensus ${state.toUpperCase()}`)
  const el = document.querySelector('#consensus')
  el.textContent = state
  el.className = `status ${state}`
})

const stringify = (obj) => JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)

client.addHeadChangedListener(async (hash) => {
  const block = await client.getBlock(hash)
  document.querySelector('#block').textContent = `${block.height} (${block.type})`
  document.querySelector('#block-json').textContent = stringify(block)

  if (block.type === 'micro') {
    document.querySelector('#producer-json').textContent = stringify(block.producer)
    console.log('Micro block producer:', block.producer)
  } else {
    document.querySelector('#producer-json').textContent = '(macro block - no producer field)'
  }
})

client.addPeerChangedListener((peerId, reason, numPeers) => {
  document.querySelector('#peers').textContent = numPeers
})
