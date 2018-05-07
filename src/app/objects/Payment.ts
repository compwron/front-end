
export interface Payment {
	account_id: string
	amount: number
	auto_release: boolean
	callback_uri: string
	chargeback: Chargeback
	checkout_id: number
	create_time: number
	currency: string
	delivery_type: string
	fee: Fee
	hosted_checkout: HostedCheckout
	payer: Payer
	refund: Refund
	short_description: string
	soft_descriptor: string
	state: string
	type: string
}

export interface PaymentList {
	(key: string): Payment
}

export interface Chargeback {
	amount_charged_back: number
	dispute_uri: string
}

export interface Fee {
	app_fee: number
	fee_payer: string
	processing_fee: number
	gross: number
}

export interface HostedCheckout {
	auto_capture: boolean
	checkout_uri: string
	mode: string
	redirect_uri: string
	require_shipping: boolean
	shipping_address: string
	shipping_fee: number
	theme_object: string
	in_review: boolean
	long_description: string
	npo_information: string
}

export interface Payer {
	email: string
	home_address: string
	name: string
	payment_error: string
	payment_method: string
	reference_id: string
}

export interface Refund {
	amount_refunded: number
	refund_reason: string
}