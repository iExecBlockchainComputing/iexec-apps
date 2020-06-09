docker run                                             \
	-v $PWD/iexec_in:/iexec_in                           \
	-v $PWD/iexec_out:/iexec_out                         \
	-e IEXEC_DATASET_FILENAME='BoardroomMeetingSuggestion.zip' \
	iexechub/meme-generator:0.0.1                        \
	'["What is great about iExec V3?","E2E Encryption","Doracles","MemeGenerator"]'

mv iexec_out/result.jpg 1.jpg

docker run                                      \
	-v $PWD/iexec_in:/iexec_in                    \
	-v $PWD/iexec_out:/iexec_out                  \
	-e IEXEC_DATASET_FILENAME='DistractedBoyfriend.zip' \
	iexechub/meme-generator:0.0.1                 \
	'["Me using iExec V3 Dataset monetization","Valuable medical datasets","Meme templates"]'

mv iexec_out/result.jpg 2.jpg

docker run                                   \
	-v $PWD/iexec_in:/iexec_in                 \
	-v $PWD/iexec_out:/iexec_out               \
	-e IEXEC_DATASET_FILENAME='TrumpBillSigning.zip' \
	iexechub/meme-generator:0.0.1              \
	"[\"iExec V3 is amazing. I know them well. It's a great team with a great product.\",\"All in RLC\"]"

mv iexec_out/result.jpg 3.jpg
