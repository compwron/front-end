export interface Donation {
	account_id: number
	amount: number
	checkout_id: number
	create_time: number
	currency: string
	fee: Fee
	gross: number
	hosted_checkout: HostedCheckout
	long_description: string
	payer: Payer
	short_description: string
	campaign?: string
}

interface Fee {
	app_fee: number
	fee_payer: string
	processing_fee: number
}

interface HostedCheckout {
	checkout_uri: string
	redirect_uri: string
}

interface Payer {
	email: string
	home_address?: string
	name: string
}