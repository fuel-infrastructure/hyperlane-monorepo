use crate::{
    contracts::interchain_security_module::InterchainSecurityModule as InterchainSecurityModuleContract,
    conversions::*, ConnectionConf, FuelProvider,
};
use async_trait::async_trait;
use fuels::{
    accounts::wallet::WalletUnlocked,
    programs::calls::Execution,
    types::{bech32::Bech32ContractId, Bytes},
};
use hyperlane_core::{
    ChainCommunicationError, ChainResult, ContractLocator, HyperlaneChain, HyperlaneContract,
    HyperlaneDomain, HyperlaneMessage, HyperlaneProvider, InterchainSecurityModule, ModuleType,
    RawHyperlaneMessage, H256, U256,
};

/// A reference to a AggregationIsm contract on some Fuel chain
#[derive(Debug)]
pub struct FuelInterchainSecurityModule {
    contract: InterchainSecurityModuleContract<WalletUnlocked>,
    domain: HyperlaneDomain,
    provider: FuelProvider,
}

impl FuelInterchainSecurityModule {
    /// Create a new fuel validator announce contract
    pub async fn new(
        conf: &ConnectionConf,
        locator: ContractLocator<'_>,
        mut wallet: WalletUnlocked,
    ) -> ChainResult<Self> {
        let fuel_provider = FuelProvider::new(locator.domain.clone(), conf).await;

        wallet.set_provider(fuel_provider.provider().clone());
        let address = Bech32ContractId::from_h256(&locator.address);

        Ok(FuelInterchainSecurityModule {
            contract: InterchainSecurityModuleContract::new(address, wallet),
            domain: locator.domain.clone(),
            provider: fuel_provider,
        })
    }
}

impl HyperlaneContract for FuelInterchainSecurityModule {
    fn address(&self) -> H256 {
        self.contract.contract_id().into_h256()
    }
}

impl HyperlaneChain for FuelInterchainSecurityModule {
    fn domain(&self) -> &HyperlaneDomain {
        &self.domain
    }

    fn provider(&self) -> Box<dyn HyperlaneProvider> {
        Box::new(self.provider.clone())
    }
}

#[async_trait]
impl InterchainSecurityModule for FuelInterchainSecurityModule {
    async fn module_type(&self) -> ChainResult<ModuleType> {
        if self.address() == H256::zero() {
            return Ok(ModuleType::Null);
        }

        self.contract
            .methods()
            .module_type()
            .simulate(Execution::StateReadOnly)
            .await
            .map_err(ChainCommunicationError::from_other)
            .map(|res| IsmType(res.value).into())
    }

    async fn dry_run_verify(
        &self,
        message: &HyperlaneMessage,
        metadata: &[u8],
    ) -> ChainResult<Option<U256>> {
        self.contract
            .methods()
            .verify(
                Bytes(metadata.to_vec()),
                Bytes(RawHyperlaneMessage::from(message)),
            )
            .determine_missing_contracts(Some(10))
            .await
            .map_err(ChainCommunicationError::from_other)?
            .simulate(Execution::Realistic)
            .await
            .map_err(ChainCommunicationError::from_other)
            .map(|res| Some(U256::from(res.gas_used)))
    }
}