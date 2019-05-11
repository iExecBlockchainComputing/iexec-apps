docker run                                              \
	-v $PWD/iexec_in:/iexec_in                            \
	-v $PWD/iexec_out:/iexec_out                          \
	-e DATASET_FILENAME='BoardroomMeetingSuggestion1.zip' \
	iexechub/meme-generator:0.0.1                         \
	'["What is great about iExec V3?","E2E Encryption","Doracles","MemeGenerator"]'
