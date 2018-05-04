// a comment
export interface Resource {
	created: number
	banner: string
	banner_large: string
	title: string
	teaser: string
	author: Author
}

export interface Author {
	displayName: string
	uid: string
	profile_pic?: string
}