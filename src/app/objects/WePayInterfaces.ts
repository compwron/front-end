// these interfaces are used exclusively for WePay calls/returns

export interface AccessToken {
	"user_id": string
	"access_token": string
	"token_type": string
	"expires_in": string
}

export interface WePayMerchant {
	"account_id": number
	"name": string
	"description": string
	"owner_user_id": number
	"type": string
	"create_time": number
	"country": string
	"currencies": Array<string>
	"error"?: string
	"error_code"?: number
}

export interface WePayRegistration {
	"access_token": string
	"uid": string
	"displayName": string
}

export interface WePayPayment {
	"checkout_id": string
	"checkout_uri": string
	"error"?: string
	"error_code"?: number
	"amount": number
	"hosted_checkout": HostedCheckout
}

interface HostedCheckout {
	"checkout_uri": string
	"mode": string
	"redirect_uri": string
	"shipping_fee": number
	"require_shipping": boolean
}