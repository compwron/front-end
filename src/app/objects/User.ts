
import { AccessToken, WePayMerchant } from './WePayInterfaces'

export class User {
	uid: string
	displayName: string
	email: string
	phoneNumber: string
	wepay?: AccessToken
	wepay_merchant?: WePayMerchant
}
