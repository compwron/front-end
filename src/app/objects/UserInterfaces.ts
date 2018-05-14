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
	profile_pic?: ProfilePic
	notification_details?: NotificationDetails
	donations?: Array<Donation>
}

	// uid?: string
	// displayName?: string
	// email?: string
	// phoneNumber?: string
	// wepay?: AccessToken
	// wepay_merchant?: WePayMerchant
	// profile_pic?: string
	// donations?: PaymentList

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
	profile_pic?: ProfilePic
	notification_details?: NotificationDetails
}

export interface ProfilePic {
	url: string
	path: string
}