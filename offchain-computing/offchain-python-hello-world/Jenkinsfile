@Library('jenkins-library@1.0.2') _

// Build native docker image
buildSimpleDocker(buildContext: 'cloud-computing/offchain-python-hello-world',
  dockerImageRepositoryName: 'offchain-python-hello-world',
  imageprivacy: 'public')

  // Build tee docker images
  node('docker') {

      def sconifyToolImageName = 'scone-production/iexec-sconify-image'
      def sconifyToolImageVersion = '5.3.6'
      def sconifyToolArgsPath = 'cloud-computing/offchain-python-hello-world/sconify.args'

      def gitShortCommit = sh(
              script: 'git rev-parse --short HEAD',
              returnStdout: true)
              .trim()
      def gitTag = sh(
              script: 'git tag --points-at HEAD|tail -n1',
              returnStdout: true)
              .trim()
      def imageTag = ("$gitTag" =~ /^\d{1,}\.\d{1,}\.\d{1,}$/)
              ? "$gitTag"
              : "$gitShortCommit-dev"

      def imageRegistry = 'docker.io/iexechub'
      def imageName = 'offchain-python-hello-world'
      def nativeImage = "$imageRegistry/$imageName:$imageTag"
      def unlockedImage = "nexus.iex.ec/$imageName-unlocked:$imageTag-debug";
      def debugImage = "$imageRegistry/$imageName:$imageTag-debug"
      def productionImage = "$imageRegistry/$imageName:$imageTag-production";


      // /!\ UNLOCKED VERSION /!\
      stage('Trigger "unlocked" TEE debug image build') {
          sconeSigning(
                  IMG_FROM: "$nativeImage",
                  IMG_TO: "$unlockedImage",
                  SCRIPT_CONFIG: "$sconifyToolArgsPath",
                  SCONE_IMG_NAME: 'sconecuratedimages/iexec-sconify-image',
                  SCONE_IMG_VERS: '5.3.3',
                  FLAVOR: 'DEBUG'
          )
      }

      stage('Trigger TEE debug image build') {
          sconeSigning(
                  IMG_FROM: "$nativeImage",
                  IMG_TO: "$debugImage",
                  SCRIPT_CONFIG: "$sconifyToolArgsPath",
                  SCONE_IMG_NAME: "$sconifyToolImageName",
                  SCONE_IMG_VERS: "$sconifyToolImageVersion",
                  FLAVOR: 'DEBUG'
          )
      }

      stage('Trigger TEE production image build') {
          if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'v6.0') {
              sconeSigning(
                      IMG_FROM: "$nativeImage",
                      IMG_TO: "$productionImage",
                      SCRIPT_CONFIG: "$sconifyToolArgsPath",
                      SCONE_IMG_NAME: "$sconifyToolImageName",
                      SCONE_IMG_VERS: "$sconifyToolImageVersion",
                      FLAVOR: 'PROD'
              )
          }
      }
  }
