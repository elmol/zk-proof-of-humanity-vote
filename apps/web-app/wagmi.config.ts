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
            31337: '0xd3880d89Cf6604875b51edB69d88e56F4f6588c8',
            1337: '0xd3880d89Cf6604875b51edB69d88e56F4f6588c8',
        },
      }}),
    react({
      useContract: true,
      useContractRead: true
    }),
  ],
})