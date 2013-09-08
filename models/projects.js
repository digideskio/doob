module.exports = function(mongoose, models, async) {

	var _objectId = function() {
		return new Buffer((new mongoose.Types.ObjectId).toString()).toString('base64');
	};


	// defining schemas
	var SoundPatternSchema = new mongoose.Schema({
		
		_id: {type: String, required: true, unique: true},
		name: String,
		userid: {type: String, required: true, unique: true},
		username: String,
		created: Number,
		updated: Number,
		sounds: Number,
		forksCount: {type: String, default: 0}, 
		forks: {
			userid: String,
			timestamp: {type: String, default: new Date().getTime()}
		},
		content: {}

	});

	SoundPatternSchema.add({ active: Boolean });

	// schema settings
	SoundPatternSchema.set('autoIndex', false);
	// SoundPatternSchema.index({
	// 	name: 1,
	// 	username: 1
	// });

	// models
	var SoundPattern = mongoose.model('SoundPattern', SoundPatternSchema);

	var newSoundPattern = function(data, session, callbackFn) {
		
		var pattern = data.message.pattern, soundsCount = 0;

		for (var i in pattern.tracks) ++soundsCount;



		if (!pattern.name) return;

		var sp = new SoundPattern({
			_id: _objectId(),
			active: true,
			name: pattern.name,
			userid: session.uid,
			username: session.username,
			created: data.timestamp ? data.timestamp : new Date().getTime(),
			updated: data.timestamp ? data.timestamp : new Date().getTime(),
			sounds: soundsCount,
			content: {
				tempo: pattern.tempo,
				steps: pattern.steps,
				bars: pattern.bars,
				tracks: pattern.tracks
			},
		});

		async.waterfall([
			function(callback) {
				sp.save(function(error){
					callback(error, sp);
				});
			},
			function(sp, callback) {
				// models.User.saveSoundPattern(sp, function(error, username) {
				// 	callback(error, sp);
				// });
				models.User.User.update({_id: session.uid}, {$inc: {soundPatterns: 1}})
			}
		], function(error, sp) {
			if (callbackFn) callbackFn(error, sp);
		});
	};

	var update = function(data, session) {
		var pattern = data.message;
		// for (var i in pattern.tracks)

		SoundPattern.update(
			{ _id: pattern.id }, { $set: { 
				'content.tracks': pattern.tracks,
				updated: new Date().getTime() 
			} }, 
			function(error, res) {
				if (error) console.log(error)
			});

		// SoundPattern.findById(pattern.id, function(error, sp){
		// 	for (var i in pattern.tracks) {
				
		// 		sp.content.tracks[i] = pattern.tracks[i];
		// 		console.log(i)
		// 	}

		// 	if (error) return console.log(error);

		// 	sp.updated = new Date().getTime();
		// 	// sp.content.tracks = pattern.tracks;
		// 	sp.markModified('content');
		// 	sp.save(function(error) {
		// 	console.log(error);
		// 		if (error) return error;
		// 		console.log(sp.content.tracks)
		// 	});
		// });
	}

	var fetchSoundPatterns = function(userid, callbackFn) {

		if (!userid || !callbackFn) return;

		SoundPattern.find({userid: userid, active: true}, callbackFn);
	}

	return {
		newSoundPattern: newSoundPattern,
		update: update,
		fetchSoundPatterns: fetchSoundPatterns,
		SoundPattern: SoundPattern
	};
};