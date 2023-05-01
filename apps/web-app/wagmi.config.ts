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
            31337: '0xFEcb9C97B3CeA50D69B4f70571b622394441030D',
            1337: '0xFEcb9C97B3CeA50D69B4f70571b622394441030D',
        },
      }}),
    react({
      useContract: true,
      useContractRead: true
    }),
  ],
})