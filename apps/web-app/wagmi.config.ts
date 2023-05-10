import { defineConfig } from '@wagmi/cli'
import { hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated/zk-voting.ts',
  plugins: [
    hardhat({
      artifacts: 'artifacts/contracts',
      project: '../contracts',
      include: ['ZKVoting.json'],
      deployments: {
        ZKVoting: {
            5: '0xbfdF33c66A1b334fD06d6655e8c389c416c2fd3a',
            31337: '0xd3880d89Cf6604875b51edB69d88e56F4f6588c8',
            1337: '0xd3880d89Cf6604875b51edB69d88e56F4f6588c8',
            11155111:'0x925a401C30309F8586ee68de29d615D80C188bE4'
        },
      }}),
    react({
      useContract: true,
      useContractRead: true
    }),
  ],
})