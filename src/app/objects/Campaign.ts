import { Payment, PaymentList } from './Payment'

export interface Campaign {
	account_id?: string
	id?: string
	banner: string
	thumbnail: string
	name: string
	owner: Owner
	type: string
	description: string
	begin: Date
	end: Date
	current: number
	goal: number
	_updated: Date
	privacy: string
	affiliate_links: string[] //	AffiliateLinks
	shared: object
	active: boolean
	thanks: string
	family_email: string
	email_message: string
	payments: PaymentList
}

// export interface AffiliateLinks {
// 	(key: string): string
// }

export interface Owner {
	uid: string
	displayName: string
	profile_pic: string
}

export interface Shared {
	(key: string): number
}