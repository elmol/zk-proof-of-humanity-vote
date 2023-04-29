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
            31337: '0x5bCC3154698bBC205ABF09351A52DD2d1A39F608',
            1337: '0x5bCC3154698bBC205ABF09351A52DD2d1A39F608',
        },
      }}),
    react({
      useContract: true,
      useContractRead: true
    }),
  ],
})