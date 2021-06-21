@Library('jenkins-library') _

def tasks = [:]
/*tasks["task_nodejs"] = {
    stage ("Build NodeJs Hello World"){
        def nativeImage = buildSimpleDocker_v2(buildContext: 'cloud-computing/nodejs-hello-world',
                dockerImageRepositoryName: 'nodejs-hello-world', imageprivacy: 'public')
        sconeBuildAllTee(nativeImage: nativeImage, targetImageRepositoryName: 'nodejs-hello-world',
                sconifyArgsPath: 'cloud-computing/nodejs-hello-world/sconify.args')
    }
}*/
tasks["task_go"] = {
    stage ("Build Go Hello World"){
        def nativeImage = buildSimpleDocker_v2(buildContext: 'cloud-computing/go-hello-world',
                dockerImageRepositoryName: 'go-hello-world', imageprivacy: 'public')
        sconeBuildAllTee(nativeImage: nativeImage, targetImageRepositoryName: 'go-hello-world',
                sconifyArgsPath: 'cloud-computing/go-hello-world/sconify.args')
    }
}
tasks["task_python"] = {
    stage ("Build Python Hello World"){
        def nativeImage = buildSimpleDocker_v2(buildContext: 'offchain-computing/offchain-python-hello-world',
                dockerImageRepositoryName: 'offchain-python-hello-world', imageprivacy: 'public')
        sconeBuildAllTee(nativeImage: nativeImage, targetImageRepositoryName: 'offchain-python-hello-world',
                sconifyArgsPath: 'offchain-computing/offchain-python-hello-world/sconify.args')
    }
}
parallel tasks
