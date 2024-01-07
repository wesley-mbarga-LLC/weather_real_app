pipeline {
    agent {
        label 'Jenkins-static-agent'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '7'))
        // skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout (time: 1, unit: 'MINUTES')
        timestamps()
    }

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: '')
        string(name: 'DB_IMAGE_VERSION', defaultValue: 'develop', description: '')
        string(name: 'REDIS_IMAGE_VERSION', defaultValue: 'develop', description: '')
        string(name: 'UI_IMAGE_VERSION', defaultValue: 'develop', description: '')
        string(name: 'WEATHER_IMAGE_VERSION', defaultValue: 'develop', description: '')
        string(name: 'AUTH_IMAGE_VERSION', defaultValue: 'develop', description: '')
    }    

    environment {
       DOCKERHUB_CREDENTIALS = credentials('docker-cred')
    }

    stages {
        stage ('Checkout') {
            steps {
                dir("${WORKSPACE}/weather_real_app") {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${params.BRANCH_NAME}"]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[$class: 'LocalBranch']],
                        submoduleCfg: [],
                        userRemoteConfigs: [[
                        url: 'git@github.com:s5wesley/weather_real_app.git',
                        credentialsId: 'jenkins-github-key'
                        ]]
                    ])
                }
            }
        }

        stage('Open the compose file') {
            steps {
                script {
                    dir("${WORKSPACE}/weather_real_app/docker-compose.yaml") {
                        sh """
                            cat docker-compose.yaml
                        """
                    }
                }
            }
        }
        stage('Set image version') {
            steps {
                script {
                    dir("${WORKSPACE}/weather_real_app/docker-compose.yaml") {
                        settingUpVariable()
                    }
                }
            }
        }
        stage('Pull Images') {
            steps {
                script {
                    dir("${WORKSPACE}/weather_real_app/docker-compose.yaml") {
                        pullImages()
                    }
                }
            }
        }
        // stage('run') {
        //     steps {
        //         script {
        //             dir("${WORKSPACE}/code/jenkins/scripts") {
        //                 sh """
        //                     ls -l
        //                     sudo chmod +x cover-letter.sh
        //                     sudo bash cover-letter.sh ${params.PACKAGES} ${params.USERNAME} ${params.PASSWORD} ${params.EMAIL} ${params.FIRSTNAME} ${params.LASTNAME} ${params.ACCOUNT_MANAGEMENT}
        //                 """
        //             }
        //         }
        //     }
        // }
    }
}



def settingUpVariable() {
    sh """
    sed -i "s|DB_IMAGE_VERSION|${params.DB_IMAGE_VERSION}|g" docker-compose.yaml
    sed -i "s|REDIS_IMAGE_VERSION|${params.REDIS_IMAGE_VERSION}|g" docker-compose.yaml
    sed -i "s|UI_IMAGE_VERSION|${params.UI_IMAGE_VERSION}|g" docker-compose.yaml
    sed -i "s|WEATHER_IMAGE_VERSION|${params.WEATHER_IMAGE_VERSION}|g" docker-compose.yaml
    sed -i "s|AUTH_IMAGE_VERSION|${params.AUTH_IMAGE_VERSION}|g" docker-compose.yaml
    
    cat docker-compose.yaml
    """
}

def pullImages() {
    sh """
    sudo docker pull devopseasylearning/sixfure-db:${params.DB_IMAGE_VERSION}
    sudo docker pull devopseasylearning/sixfure-redis:${params.REDIS_IMAGE_VERSION}
    sudo docker pull devopseasylearning/sixfure-ui:${params.UI_IMAGE_VERSION}
    sudo docker pull devopseasylearning/sixfure-weather:${params.WEATHER_IMAGE_VERSION}
    sudo docker pull devopseasylearning/sixfure-auth:${params.AUTH_IMAGE_VERSION}
    sudo docker images
    sudo docker-compose down
    sudo docker-compose up -d
    sudo docker-compose ps
    """
}




// sed -i "s|DB_IMAGE_VERSION|develop|g" docker-compose.yaml
// sed -i "s|REDIS_IMAGE_VERSION|develop|g" docker-compose.yaml
// sed -i "s|UI_IMAGE_VERSION|develop|g" docker-compose.yaml
// sed -i "s|WEATHER_IMAGE_VERSION|develop|g" docker-compose.yaml
// sed -i "s|AUTH_IMAGE_VERSION|develop|g" docker-compose.yaml

// cat docker-compose.yaml