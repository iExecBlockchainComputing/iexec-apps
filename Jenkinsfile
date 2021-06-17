@Library('jenkins-library') _

buildSimpleDocker(buildContext: 'cloud-computing/go-hello-world',
  dockerImageRepositoryName: 'go-hello-world',
  imageprivacy: 'public')

sconeBuildAllTee(imageName: 'go-hello-world',
  sconifyArgsPath: 'cloud-computing/go-hello-world/sconify.args')
