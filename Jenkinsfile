@Library('jenkins-library') _

def nativeImage = buildSimpleDocker_v2(buildContext: 'cloud-computing/go-hello-world',
        dockerImageRepositoryName: 'go-hello-world', imageprivacy: 'public')
sconeBuildAllTee(nativeImage: nativeImage, targetImageRepositoryName: 'go-hello-world',
        sconifyArgsPath: 'cloud-computing/go-hello-world/sconify.args')
