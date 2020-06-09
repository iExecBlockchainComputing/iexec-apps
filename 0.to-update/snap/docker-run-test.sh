#!/bin/sh

docker_image_id="$1"

docker run -it $docker_image_id bash https://raw.githubusercontent.com/iExecBlockchainComputing/iexec-dapps-registry/snap/iExecBlockchainComputing/Snap/resample/resample_s2.xml https://raw.githubusercontent.com/iExecBlockchainComputing/iexec-dapps-registry/snap/iExecBlockchainComputing/Snap/resample/resample_20m.properties https://s3.amazonaws.com/esa-snap-poc/S2A_MSIL1C_20180807T101021_N0206_R022_T32TQR_20180809T104755.zip
