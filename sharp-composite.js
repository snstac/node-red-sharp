module.exports = function (RED) {
	"use strict";
	const sharp = require("sharp");

	function SharpCompositeNode(config) {
		RED.nodes.createNode(this, config);

		this.overlay = config.overlay;
		this.blend = config.blend;

		var node = this;
		node.on('input', function (msg) {
			const overlay = Buffer.from(msg.sharp?.overlay ?? null)
			const blend = msg.sharp?.blend ?? 'over';

			if (Buffer.isBuffer(msg.payload)) {
				sharp(msg.payload)
					.composite([{ input: overlay, blend: blend }])
					.toBuffer()
					.then(imageBuffer => {
						msg.payload = imageBuffer;
						node.send(msg);
					})
					.catch(err => {
						node.error('[sb-sharp] Error applying composite to image:', err);
					});
			} else {
				node.error('[sb-sharp] The payload was not an image buffer.');
			}
		});
	}
	RED.nodes.registerType("sharp-composite", SharpCompositeNode);
}