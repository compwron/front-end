
import { AccessToken, WePayMerchant } from './WePayInterfaces'
import { PaymentList, Payment } from './Payment'

export class User {
	uid: string
	displayName: string
	email: string
	phoneNumber?: string
	wepay?: AccessToken
	wepay_merchant?: WePayMerchant
	profile_pic?: string
	donations?: PaymentList
}
