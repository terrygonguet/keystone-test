var keystone = require('keystone');
var IOMeter = keystone.list('Interestometer');

module.exports = async function (req, res) {
	switch (req.method) {
		case 'POST':
			let record = new IOMeter.model();
			let updater = record.getUpdateHandler(req);
			try {
				await new Promise(function (resolve, reject) {
					updater.process(req.body, function (err) {
						if (err) reject(err);
						else resolve();
					});
				});
			} catch (error) {
				return res.status(400).json(error);
			}
			// fallthrough to returning counts after POST
		case 'GET':
			let counts = await IOMeter.model.aggregate([{
				$group: {
					_id: '$interesting',
					count: { $sum: 1 },
				},
			}]).exec();
			let data = { true: 0, false: 0 };
			counts.forEach(c => (data[c._id] = c.count));
			return res.json(data);
		default:
			return res.status(405).end();
	}
};
