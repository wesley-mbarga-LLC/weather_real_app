pipeline {
    agent any
    
    environment {
        DB_IMAGE_VERSION = 'v2' // Define your desired versions here
        REDIS_IMAGE_VERSION = 'v2'
        WEATHER_IMAGE_VERSION = 'v2'
        AUTH_IMAGE_VERSION = 'v2'
        UI_IMAGE_VERSION = 'v2'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub2')
    }
    
    stages {
        stage('Build and Push Docker Images') {
            steps {
                script {
                    docker.build("bulawesley/db:${DB_IMAGE_VERSION}", "./db")
                    docker.build("bulawesley/redis:${REDIS_IMAGE_VERSION}", "./redis")
                    docker.build("bulawesley/weather:${WEATHER_IMAGE_VERSION}", "./weather")
                    docker.build("bulawesley/auth:${AUTH_IMAGE_VERSION}", "./auth")
                    docker.build("bulawesley/ui:${UI_IMAGE_VERSION}", "./ui")
                    docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
                        docker.image("bulawesley/db:${DB_IMAGE_VERSION}").push()
                        docker.image("bulawesley/redis:${REDIS_IMAGE_VERSION}").push()
                        docker.image("bulawesley/weather:${WEATHER_IMAGE_VERSION}").push()
                        docker.image("bulawesley/auth:${AUTH_IMAGE_VERSION}").push()
                        docker.image("bulawesley/ui:${UI_IMAGE_VERSION}").push()
                    }
                }
            }
        }
        
        stage('Deploy Services') {
            steps {
                sh 'docker-compose up -d'
                sh 'docker-compose ps'
            }
        }
    }
    
    post {
        always {
            script {
                dockerComposeStop()
            }
        }
    //     success {
    //         script {
    //             slackSend color: '#2EB67D',
    //                 channel: 'general',
    //                 message: "*WEATHER_APP Project Build Status*" +
    //                     "\n Project Name: s5wesley-WESTHER-APP" +
    //                     "\n Job Name: ${env.JOB_NAME}" +
    //                     "\n Build number: ${currentBuild.displayName}" +
    //                     "\n Build Status : *SUCCESS*" +
    //                     "\n Build url : ${env.BUILD_URL}"
    //         }
    //     }
    //     failure {
    //         script {
    //             slackSend color: '#E01E5A',
    //                 channel: 'general',
    //                 message: "*WEATHER_APP Project Build Status*" +
    //                     "\n Project Name: s5wesley-WESTHER-APP" +
    //                     "\n Job Name: ${env.JOB_NAME}" +
    //                     "\n Build number: ${currentBuild.displayName}" +
    //                     "\n Build Status : *FAILED*" +
    //                     "\n Build url : ${env.BUILD_URL}"
    //         }
    //     }
    // }

    def dockerComposeStop() {
        sh 'docker-compose down'
    }
}
}
