
export class Campaign {
	id: string
	banner: string
	name: string
	type: string
	description: string
	begin: Date
	end: Date
	current: number
	goal: number
	_updated: Date
	privacy: boolean
	affiliate_links: object
	shared: object
	published: boolean
}