// Generated by @wagmi/cli@0.1.15 on 5/1/2023 at 6:00:16 PM
import {
  useNetwork,
  useContract,
  UseContractConfig,
  useContractRead,
  UseContractReadConfig,
} from 'wagmi'
import { ReadContractResult } from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZKVoting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * -
 */
export const zkVotingABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_pollId', internalType: 'uint256', type: 'uint256' },
      { name: '_proposal', internalType: 'string', type: 'string' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pollId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposal',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
] as const

/**
 * -
 * -
 */
export const zkVotingAddress = {
  1337: '0xFEcb9C97B3CeA50D69B4f70571b622394441030D',
  31337: '0xFEcb9C97B3CeA50D69B4f70571b622394441030D',
} as const

/**
 * -
 * -
 */
export const zkVotingConfig = {
  address: zkVotingAddress,
  abi: zkVotingABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContract}__ with `abi` set to __{@link zkVotingABI}__.
 *
 * -
 * -
 */
export function useZkVoting(
  config: Omit<UseContractConfig, 'abi' | 'address'> & {
    chainId?: keyof typeof zkVotingAddress
  } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContract({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zkVotingABI}__.
 *
 * -
 * -
 */
export function useZkVotingRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof zkVotingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zkVotingABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zkVotingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractRead({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    ...config,
  } as UseContractReadConfig<typeof zkVotingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zkVotingABI}__ and `functionName` set to `"pollId"`.
 *
 * -
 * -
 */
export function useZkVotingPollId<
  TSelectData = ReadContractResult<typeof zkVotingABI, 'pollId'>,
>(
  config: Omit<
    UseContractReadConfig<typeof zkVotingABI, 'pollId', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zkVotingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractRead({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    functionName: 'pollId',
    ...config,
  } as UseContractReadConfig<typeof zkVotingABI, 'pollId', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zkVotingABI}__ and `functionName` set to `"proposal"`.
 *
 * -
 * -
 */
export function useZkVotingProposal<
  TSelectData = ReadContractResult<typeof zkVotingABI, 'proposal'>,
>(
  config: Omit<
    UseContractReadConfig<typeof zkVotingABI, 'proposal', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zkVotingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractRead({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    functionName: 'proposal',
    ...config,
  } as UseContractReadConfig<typeof zkVotingABI, 'proposal', TSelectData>)
}
