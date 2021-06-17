@Library('jenkins-library') _

def goImageName = 'go-hello-world'
buildSimpleDocker_v2(buildContext: 'cloud-computing/go-hello-world',
  dockerImageRepositoryName: goImageName,
  imageprivacy: 'public')
sconeBuildAllTee(imageName: goImageName,
  sconifyArgsPath: 'cloud-computing/go-hello-world/sconify.args')
