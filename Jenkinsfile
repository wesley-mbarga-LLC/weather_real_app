pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("bulawesley/db:v1", "./db")
                    docker.build("bulawesley/redis:v1", "./redis")
                    docker.build("bulawesley/weather:v1", "./weather")
                    docker.build("bulawesley/auth:v1", "./auth")
                    docker.build("bulawesley/ui:v1", "./ui")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }
    }
    
    post {
        always {
            script {
                sh 'docker-compose -f docker-compose.yml ps'
            }
        }
        
        success {
            script {
                slackSend color: '#2EB67D',
                    channel: 'general',
                    message: "*WEATHER_APP Project Build Status*" +
                        "\n Project Name: s5wesley-WESTHER-APP" +
                        "\n Job Name: ${env.JOB_NAME}" +
                        "\n Build number: ${currentBuild.displayName}" +
                        "\n Build Status : *SUCCESS*" +
                        "\n Build url : ${env.BUILD_URL}"
            }
        }
        failure {
            script {
                slackSend color: '#E01E5A',
                    channel: 'general',
                    message: "*WEATHER_APP Project Build Status*" +
                        "\n Project Name: s5wesley-WESTHER-APP" +
                        "\n Job Name: ${env.JOB_NAME}" +
                        "\n Build number: ${currentBuild.displayName}" +
                        "\n Build Status : *FAILED*" +
                        "\n Build url : ${env.BUILD_URL}"
            }
        }
    }
}
