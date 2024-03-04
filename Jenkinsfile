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
        stage('Build db') {
            steps {
                sh '''
                    cd $WORKSPACE/db
                    docker build -t bulawesley/db:${BUILD_NUMBER}.1 .
                '''
            }
        }

        stage('Build redis') {
            steps {
                sh '''
                    cd $WORKSPACE/redis
                    docker build -t bulawesley/redis:${BUILD_NUMBER}.1 .
                '''
            }
        }

        stage('Build weather') {
            steps {
                sh '''
                    cd $WORKSPACE/weather
                    docker build -t bulawesley/weather:${BUILD_NUMBER}.1 .
                '''
            }
        }

        stage('Build auth') {
            steps {
                sh '''
                    cd $WORKSPACE/auth
                    docker build -t bulawesley/auth:${BUILD_NUMBER}.1 .
                '''
            }
        }

        stage('Build ui') {
            steps {
                sh '''
                    cd $WORKSPACE/ui
                    docker build -t bulawesley/ui:${BUILD_NUMBER}.1 .
                '''
            }
        }


        stage('Push db') {
            when {
                expression {
                    env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh '''
                    docker push bulawesley/db:${BUILD_NUMBER}.1
                '''
            }
        }

        stage('Push redis') {
            when {
                expression {
                    env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh '''
                    docker push bulawesley/redis:${BUILD_NUMBER}.1
                '''
            }
        }

        stage('Push weather') {
            when {
                expression {
                    env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh '''
                    docker push bulawesley/weather:${BUILD_NUMBER}.1
                '''
            }
        }

                stage('Push auth') {
            when {
                expression {
                    env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh '''
                    docker push bulawesley/auth:${BUILD_NUMBER}.1
                '''
            }
        }

        stage('Push ui') {
            when {
                expression {
                    env.GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh '''
                    docker push bulawesley/ui:${BUILD_NUMBER}.1
                '''
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

    // def dockerComposeStop() {
    //     sh 'docker-compose down'
    // }
}
}
