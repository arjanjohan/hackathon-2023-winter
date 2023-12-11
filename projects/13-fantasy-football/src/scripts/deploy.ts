import { ethers, run } from 'hardhat';
import fs from 'fs';
import path from 'path';
import hre from 'hardhat';
import {BaseContract} from "ethers";

async function readConstructorArgumentsFromCsv(network: string, csvFilePath: string): Promise<any[]> {
  const csvContent = fs.readFileSync(path.resolve(csvFilePath), { encoding: 'utf-8' });
  const lines = csvContent.split('\n');

  for (const line of lines) {
    const [networkName, ...args] = line.split(',');
    if (networkName.trim() === network) {
      // Map through args to handle empty strings correctly
      return args.map(arg => arg.trim()).filter(arg => arg);
    }
  }

  // If no arguments are found, return an empty array
  return [];
}

function saveVerificationUrl(verificationUrl: string, network: string) {
	const deploymentsPath = path.resolve('./deployments.md');
	let deploymentsContent = '';
	
	// Read the content of the file if it exists
	if (fs.existsSync(deploymentsPath)) {
		deploymentsContent = fs.readFileSync(deploymentsPath, { encoding: 'utf-8' }).trim();
	}
	
	// Format the markdown link
	const markdownLink = `[${network.charAt(0).toUpperCase() + network.slice(1)}](${verificationUrl})`;
	const networkRegex = new RegExp(`\\[${network}\\]\\(.*\\)`, 'i');
	
	// Check if the content contains the network entry already
	if (networkRegex.test(deploymentsContent)) {
		// Replace existing line
		deploymentsContent = deploymentsContent.replace(networkRegex, markdownLink);
	} else {
		// Append new line (add a newline only if the content is not empty)
		deploymentsContent += (deploymentsContent ? '\n' : '') + markdownLink;
	}
	
	// Write the updated content to the file
	fs.writeFileSync(deploymentsPath, deploymentsContent, { encoding: 'utf-8' });
	console.log(`Saved verification URL to deployments.md: ${verificationUrl}`);
	}
	  

async function deployContract(contractName: string, constructorArguments: any[]) {
  const ContractFactory = await ethers.getContractFactory(contractName);
  let contract: BaseContract; 
  // Special config for mantleTestnet
  if (hre.network.name != "mantleTestnet") {
  	contract = await ContractFactory.deploy(...constructorArguments);
  } else {
	contract = await ContractFactory.deploy(...args, { gasLimit: 10000000 });
}
  const address = await contract.getAddress()
  console.log(`Contract deployed to address: ${address}`);
  return address;
}

async function verifyContractAndCaptureUrl(network: string, contractAddress: string, constructorArguments: any[]) {
	let verificationUrl = '';
	let attempts = 0;
	const maxAttempts = 12; // Retry every 5 seconds for a total of 60 seconds
	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
	// Capture the original console.log function to restore later
	const originalConsoleLog = console.log;
  
	while (attempts < maxAttempts) {
	  try {
		// Attempt to verify the contract
		await run("verify:verify", {
		  address: contractAddress,
		  constructorArguments: constructorArguments,
		  network: network,
		});
  
		// Assume verification is successful and break the loop
		// The actual verification URL needs to be captured from the logs as per your setup
		console.log("Verification complete!");
		break;
	  } catch (error) {
		if (error.message.includes('already verified')) {
		  // If already verified, capture the URL and break
		  const match = error.message.match(/(https:\/\/\S+)/);
		  if (match && match[1]) {
			verificationUrl = match[1];
		  }
		  console.log(error.message);
		  break;
		} else {
		  // Log the error and attempt to retry
		  console.error(`Attempt ${attempts + 1}: Verification failed. Retrying in 5 seconds...`);
		  await delay(5000); // Wait for 5 seconds before the next attempt
		  attempts++;
		}
	  }
	}
  
	// Restore the original console.log function
	console.log = originalConsoleLog;
  
	return verificationUrl;
  }
  

async function main() {
  const network = hre.network.name;
  const csvFilePath = './scripts/network-params.csv'; // Path to your CSV file
  const contractName = 'FantasyFootballToken'; // Replace with your actual contract name

  // Read the constructor arguments from the CSV file for the specified network
  const constructorArguments = await readConstructorArgumentsFromCsv(network, csvFilePath);

  // Deploy the contract
  let contractAddress;
  contractAddress = await deployContract(contractName, constructorArguments);
  
  console.log(`Contract deployed to address: ${contractAddress}`);

  // Verify the contract
  const verificationUrl = await verifyContractAndCaptureUrl(network, contractAddress, constructorArguments);
	if (verificationUrl) {
		saveVerificationUrl(verificationUrl, network);
	}else {
		console.log("The verification process did not provide a URL.");
	  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
