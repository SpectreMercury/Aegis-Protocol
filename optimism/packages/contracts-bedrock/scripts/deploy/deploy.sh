#!/usr/bin/env bash
set -euo pipefail

# Ensure we're in the correct directory
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

verify_flag=""
if [ -n "${DEPLOY_VERIFY:-}" ]; then
  verify_flag="--verify"
fi

# Ensure config file exists and is readable
if [ ! -f "$DEPLOY_CONFIG_PATH" ]; then
    echo "Error: Config file not found at $DEPLOY_CONFIG_PATH"
    exit 1
fi

echo "> Using config file: $DEPLOY_CONFIG_PATH"
echo "> Current working directory: $(pwd)"

echo "> Deploying contracts"
FOUNDRY_PROFILE=deploy forge script -vvv scripts/deploy/Deploy.s.sol:Deploy \
    --rpc-url "$DEPLOY_ETH_RPC_URL" \
    --broadcast \
    --private-key "$DEPLOY_PRIVATE_KEY" \
    $verify_flag

if [ -n "${DEPLOY_GENERATE_HARDHAT_ARTIFACTS:-}" ]; then
    echo "> Generating hardhat artifacts"
    forge script -vvv scripts/deploy/Deploy.s.sol:Deploy \
        --sig 'sync()' \
        --rpc-url "$DEPLOY_ETH_RPC_URL" \
        --broadcast \
        --private-key "$DEPLOY_PRIVATE_KEY"
fi
