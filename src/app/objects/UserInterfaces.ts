// these interfaces are used exclusively for WePay calls/returns

import { AccessToken, WePayMerchant } from './WePayInterfaces'

export interface User {
	uid: string
	displayName: string
	email: string
	phoneNumber: string
	wepay?: AccessToken
	wepay_merchant?: WePayMerchant
	saving_for?: string[]
	active?: boolean
	profile_pic?: string
	notification_details?: NotificationDetails
}

export interface NotificationDetails {
	email_on_contribution_receipt?: boolean
	email_on_comment_posted?: boolean
	email_suggested_articles?: boolean
}

export interface UserUpdateObject {
	uid: string
	displayName?: string
	email?: string
	phoneNumber?: string
	wepay?: AccessToken
	wepay_merchant?: WePayMerchant
	saving_for?: string[]
	active?: boolean
	profile_pic?: string
	notification_details?: NotificationDetails
}