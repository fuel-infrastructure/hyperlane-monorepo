import { input } from '@inquirer/prompts';
import { ethers, providers } from 'ethers';
import { Wallet as FuelWallet, WalletLocked, WalletUnlocked } from 'fuels';

import { impersonateAccount } from '@hyperlane-xyz/sdk';
import {
  Address,
  ProtocolMap,
  ProtocolType,
  ensure0x,
} from '@hyperlane-xyz/utils';

const ETHEREUM_ADDRESS_LENGTH = 42;

/**
 * Retrieves a signer for the current command-context.
 * @returns the signer
 */
export async function getSigner({
  key,
  skipConfirmation,
}: {
  key?: string;
  skipConfirmation?: boolean;
}) {
  key ||= await retrieveKey(skipConfirmation);
  const signer = privateKeyToEvmSigner(key);
  return { key, signer };
}

export async function getSigners({
  keys,
  skipConfirmation,
}: {
  keys?: string;
  skipConfirmation?: boolean;
}) {
  keys ||= await retrieveKeys(skipConfirmation);

  const protocolKeys = keys.split(',').map((protocolWithKey) => {
    const [protocol, key] = protocolWithKey.split(':');
    return { protocol, key };
  });
  if (protocolKeys.length === 0) throw new Error('No keys provided');

  const signers: ProtocolMap<ethers.Wallet | WalletUnlocked | WalletLocked> =
    {};
  for (const { protocol, key } of protocolKeys) {
    switch (protocol) {
      case 'fuel':
        signers[ProtocolType.Fuel] = privateKeyToFuelSigner(key);
        break;
      case 'ethereum':
        signers[ProtocolType.Ethereum] = privateKeyToEvmSigner(key);
        break;
      default:
        throw new Error(
          `Unsupported protocol: ${protocol}, supported protocols are 'fuel' and 'ethereum'`,
        );
    }
  }

  return signers;
}

/**
 * Retrieves an impersonated signer for the current command-context.
 * @returns the impersonated signer
 */
export async function getImpersonatedSigner({
  fromAddress,
  key,
  skipConfirmation,
}: {
  fromAddress?: Address;
  key?: string;
  skipConfirmation?: boolean;
}) {
  if (!fromAddress) {
    const { signer } = await getSigner({ key, skipConfirmation });
    fromAddress = signer.address;
  }
  return {
    impersonatedKey: fromAddress,
    impersonatedSigner: await addressToImpersonatedSigner(fromAddress),
  };
}

/**
 * Verifies the specified signer is valid.
 * @param signer the signer to verify
 */
export function assertSigner(
  signer: ethers.Signer | WalletUnlocked | WalletLocked,
) {
  if (
    !signer ||
    !(
      ethers.Signer.isSigner(signer) ||
      signer instanceof WalletUnlocked ||
      signer instanceof WalletLocked
    )
  )
    throw new Error('Signer is invalid');
}

/**
 * Generates a signer from an address.
 * @param address an EOA address
 * @returns a signer for the address
 */
async function addressToImpersonatedSigner(
  address: Address,
): Promise<providers.JsonRpcSigner> {
  if (!address) throw new Error('No address provided');

  const formattedKey = address.trim().toLowerCase();
  if (address.length != ETHEREUM_ADDRESS_LENGTH)
    throw new Error('Invalid address length.');
  else if (ethers.utils.isHexString(ensure0x(formattedKey)))
    return impersonateAccount(address);
  else throw new Error('Invalid address format');
}

/**
 * Generates an EVM signer from a private key.
 * @param key an EVM private key
 * @returns an EVM signer for the private key
 */
function privateKeyToEvmSigner(key: string): ethers.Wallet {
  if (!key) throw new Error('No private key provided');

  const formattedKey = key.trim().toLowerCase();
  if (ethers.utils.isHexString(ensure0x(formattedKey)))
    return new ethers.Wallet(ensure0x(formattedKey));
  else if (formattedKey.split(' ').length >= 6)
    return ethers.Wallet.fromMnemonic(formattedKey);
  else throw new Error('Invalid EVM private key format');
}

/**
 * Generates a Fuel signer from a private key.
 * @param key a Fuel private key
 * @returns a Fuel signer for the private key
 */
function privateKeyToFuelSigner(key: string): WalletUnlocked | WalletLocked {
  if (!key) throw new Error('No private key provided');

  const formattedKey = key.trim().toLowerCase();
  const wallet = FuelWallet.fromPrivateKey(ensure0x(formattedKey));
  return wallet;
}

async function retrieveKey(
  skipConfirmation: boolean | undefined,
): Promise<string> {
  if (skipConfirmation) throw new Error(`No private key provided`);
  else
    return input({
      message: `Please enter private key or use the HYP_KEY environment variable.`,
    });
}

async function retrieveKeys(
  skipConfirmation: boolean | undefined,
): Promise<string> {
  if (skipConfirmation) throw new Error(`No private keys provided`);
  else
    return input({
      message: `
      Please enter private keys (comma separated) with a protocol prefix \n
      (e.g. 'fuel:0x1234...,ethereum:0x5678...')
      `,
    });
}
