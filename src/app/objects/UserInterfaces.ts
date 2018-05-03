// these interfaces are used exclusively for WePay calls/returns

import { AccessToken, WePayMerchant } from './WePayInterfaces'
import { Donation } from './Donation'

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
	donations: Array<Donation>
}

export interface NotificationDetails {
	contributions?: boolean
	comments?: boolean
	articles?: boolean
}

export interface UserUpdateObject {
	uid?: string
	displayName?: string
	email?: string
	password?: string
	phoneNumber?: string
	wepay?: AccessToken
	wepay_merchant?: WePayMerchant
	saving_for?: string[]
	active?: boolean
	profile_pic?: string
	notification_details?: NotificationDetails
}