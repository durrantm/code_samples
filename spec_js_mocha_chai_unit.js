'use strict';

module.exports.fizz_buzz = (number) => {
  let result = []
	const divs = { 3: 'fizz', 5: 'buzz', 7: 'duck' };
	for (let i = 1; i <= number; i++) {
    let this_result = ''
		for(const [div,text] of Object.entries(divs)) {
		  if (i % div == 0) {
		    this_result+= text
			}
		}
	  result.push(this_result == '' ? i : this_result)
	}
  return result
}
