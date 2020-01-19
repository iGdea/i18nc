/* elsint-disable no-var */

'use strict';

let topI18N_v1 = require('./topi18n_v1');
let topI18N_v2 = require('./topi18n_v2');

module.exports = function topI18N(
	msg,
	args,
	translateJSON,
	fileKey,
	data,
	handler
) {
	let funcVersion = handler.V;
	if (
		!funcVersion ||
		funcVersion.toUpperCase().charCodeAt(0) >= 'G'.charCodeAt(0)
	)
		return topI18N_v2.apply(this, arguments);
	else return topI18N_v1.apply(this, arguments);
};
