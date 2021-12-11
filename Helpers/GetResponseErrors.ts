export const GetResponseErrors = (items: Array<any>) => {
	if (Object.keys(items).length) {
		let objectValues: Array<any> = [];
		let arrayOfStrings: Array<string> = [];

		for (const key of Object.values(items)) {
			objectValues.push(key);
		}

		objectValues.map(string => {
			return arrayOfStrings.push(string);
		})
		
		return arrayOfStrings;
	}
}