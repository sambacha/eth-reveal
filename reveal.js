#!/usr/bin/env node
'use strict';

const { formatEther } = require('ethers').utils;
const program = require('commander');
const numbro = require('numbro');
const util = require('util');
const { gray, red, yellow, green, cyan } = require('chalk');
const lookup = require('./lib/lookup');

require('dotenv').config();

// perform as CLI tool if args given
if (require.main === module) {
  (async () => {
    require('pretty-error').start();

    program
      .option('-h, --hash <value>', 'Transaction hash (include 0x prefix)')
      .option('-n, --network [value]', 'Network to use', 'mainnet')
      .option(
        '-a, --`abiContract` [value]',
        'Alternative contract that would have the ABI',
      )
      .parse(process.argv);

    const { hash, network } = program;
    console.log(gray('txn:', `https://etherscan.io/tx/${hash}`));

    const {
      to,
      from,
      blockNumber,
      timestamp,
      contract,
      method,
      decodedLogs,
      gasUsed,
      status,
      errorMessage,
      revertReason,
      value,
    } = await lookup({
      hash,
      network,
      etherscanKey: process.env.ETHERSCAN_API_KEY,
      providerURI: process.env.PROVIDER_URI,
      infuraProjectID: process.env.INFURA_PROJECT_ID,
    });

    console.log(gray('from:', from));
    console.log(gray('to:', to));
    console.log(gray('block:', blockNumber));
    console.log(gray('date:', new Date(timestamp * 1000)));

    if (contract) console.log(gray('contract:', contract));

    if (method)
      console.log(
        gray(
          'method:',
          typeof method === 'string'
            ? method
            : util.inspect(method, { showHidden: true, depth: null }),
        ),
      );

    if (decodedLogs && decodedLogs.length)
      console.log(
        gray(
          'logs:',
          util.inspect(decodedLogs, {
            showHidden: true,
            depth: null,
          }),
        ),
      );

    if (Number(formatEther(value)) > 0)
      console.log(gray('value:', formatEther(value), 'ETH'));

    console.log(
      gray(
        `Gas used: ${numbro(gasUsed).format({ average: true })} (${numbro(
          gasUsed,
        ).format('0,0')})`,
      ),
    );
    console.log(
      gray('Status:'),
      status > 0 ? green('success') : red('failure'),
    );

    if (errorMessage) {
      console.log('ES error:', cyan(errorMessage));
    }
    if (revertReason) {
      console.log('Revert reason:', yellow(revertReason));
    }
  })();
}

module.exports = lookup;
