import {
	BigInt,
	BigDecimal,
	EthereumEvent,
} from '@graphprotocol/graph-ts'

import {
	PriceOracleLegacy as PriceOracleContract,
	ValueChange       as ValueChangeEvent,
} from '../generated/PriceOracle/PriceOracleLegacy'

import {
	Asset,
	Pair,
	Quotation,
} from '../generated/schema'

export function createEventID(event: EthereumEvent): string
{
	return event.block.number.toString().concat('-').concat(event.logIndex.toString())
}

export function getDecimalValue(raw: BigInt, decimal: u8): BigDecimal
{
	return raw.divDecimal(new BigDecimal(BigInt.fromI32(10).pow(decimal)))
}

export function handleValueChange(event: ValueChangeEvent): void
{
	let p = Pair.load(event.params.id.toHex())
	if (p == null)
	{
		let contract = PriceOracleContract.bind(event.address)
		let data     = contract.values(event.params.id).value3.split("-")

		p = new Pair(event.params.id.toHex())
		p.asset_base  = data[0]
		p.asset_quote = data[1]
		p.precision   = i32(parseInt(data[2]))

		let asset_base  = new Asset(p.asset_base)
		let asset_quote = new Asset(p.asset_quote)
		asset_base.save()
		asset_quote.save()
	}

	let q = new Quotation(createEventID(event));
	q.blockNumber   = event.block.number.toI32()
	q.transactionID = event.transaction.hash
	q.pair          = p.id
	q.timestamp     = event.params.newDate
	q.value         = getDecimalValue(event.params.newValue, u8(p.precision))
	q.oracleCallID  = event.params.oracleCallID

	p.latest = q.id
	p.save()
	q.save()
}
